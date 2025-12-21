"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/src/features/auth/context/auth-context';
import { get, post } from '@/src/lib/api/client';

interface PushNotificationState {
    isSupported: boolean;
    isSubscribed: boolean;
    permission: NotificationPermission | 'unknown';
    isLoading: boolean;
    error: string | null;
}

export function usePushNotifications() {
    const { user, hasRole } = useAuth();
    const [state, setState] = useState<PushNotificationState>({
        isSupported: false,
        isSubscribed: false,
        permission: 'unknown',
        isLoading: false,
        error: null
    });

    // Check if push is supported
    useEffect(() => {
        const checkSupport = () => {
            const supported = 'serviceWorker' in navigator &&
                'PushManager' in window &&
                'Notification' in window;

            setState(prev => ({
                ...prev,
                isSupported: supported,
                permission: supported ? Notification.permission : 'unknown'
            }));
        };

        checkSupport();
    }, []);

    // Check existing subscription on mount
    useEffect(() => {
        const checkSubscription = async () => {
            if (!state.isSupported) return;

            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                setState(prev => ({
                    ...prev,
                    isSubscribed: !!subscription
                }));
            } catch (error) {
                console.error('Error checking subscription:', error);
            }
        };

        checkSubscription();
    }, [state.isSupported]);

    // Subscribe to push notifications
    const subscribe = useCallback(async () => {
        if (!state.isSupported) {
            setState(prev => ({ ...prev, error: 'Push notifications not supported' }));
            return false;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Request permission
            const permission = await Notification.requestPermission();
            setState(prev => ({ ...prev, permission }));

            if (permission !== 'granted') {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Notification permission denied'
                }));
                return false;
            }

            // Register service worker
            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            // Get VAPID public key from server
            const { publicKey } = await get<{ publicKey: string }>('/push/vapid-public-key');

            // Convert VAPID key to Uint8Array
            const applicationServerKey = urlBase64ToUint8Array(publicKey);

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey
            });

            // Determine role for subscription
            const rolName = hasRole('TTHH') ? 'TTHH' :
                hasRole('GERENCIA') ? 'GERENCIA' :
                    hasRole('COLABORADOR') ? 'COLABORADOR' : 'OTHER';

            // Send subscription to server - only append ID if it's a number
            const userIdParam = user?.id && !isNaN(Number(user.id)) ? `&usuarioId=${user.id}` : '';

            // Send subscription to server
            await post(`/push/subscribe?rolName=${rolName}${userIdParam}`, subscription);

            setState(prev => ({
                ...prev,
                isLoading: false,
                isSubscribed: true,
                error: null
            }));

            return true;
        } catch (error) {
            console.error('Error subscribing to push:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Subscription failed'
            }));
            return false;
        }
    }, [state.isSupported, hasRole, user]);

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();

                await post('/push/unsubscribe', { endpoint: subscription.endpoint });
            }

            setState(prev => ({
                ...prev,
                isLoading: false,
                isSubscribed: false
            }));

            return true;
        } catch (error) {
            console.error('Error unsubscribing:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unsubscribe failed'
            }));
            return false;
        }
    }, []);

    return {
        ...state,
        subscribe,
        unsubscribe,
        isAdmin: hasRole('TTHH') || hasRole('GERENCIA')
    };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
