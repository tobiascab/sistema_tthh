"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Sun,
    Cloud,
    Umbrella
} from "lucide-react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday,
    isWeekend
} from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/src/components/ui/button";

type EventType = 'VACACIONES' | 'PERMISO' | 'ENFERMEDAD' | 'FERIADO' | 'CAPACITACION';

interface CalendarEvent {
    id: number;
    date: string;
    type: EventType;
    title: string;
    empleadoNombre?: string;
}

interface AusenciasCalendarProps {
    events?: CalendarEvent[];
    onDateSelect?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
}

const eventColors: Record<EventType, { bg: string; text: string; dot: string }> = {
    VACACIONES: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    PERMISO: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
    ENFERMEDAD: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    FERIADO: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    CAPACITACION: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' }
};

// Sample events for demonstration
const sampleEvents: CalendarEvent[] = [
    { id: 1, date: format(new Date(), 'yyyy-MM-dd'), type: 'CAPACITACION', title: 'Capacitación Seguridad' },
    { id: 2, date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), type: 'VACACIONES', title: 'Vacaciones', empleadoNombre: 'María García' },
    { id: 3, date: format(addDays(new Date(), 5), 'yyyy-MM-dd'), type: 'FERIADO', title: 'Día de la Constitución' },
    { id: 4, date: format(addDays(new Date(), -3), 'yyyy-MM-dd'), type: 'PERMISO', title: 'Permiso personal', empleadoNombre: 'Juan López' },
];

export function AusenciasCalendar({
    events = sampleEvents,
    onDateSelect,
    onEventClick
}: AusenciasCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        onDateSelect?.(date);
    };

    const getEventsForDate = (date: Date): CalendarEvent[] => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return events.filter(event => event.date === dateStr);
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEEE";
        const weekStart = startOfWeek(new Date(), { locale: es });

        for (let i = 0; i < 7; i++) {
            days.push(
                <div
                    key={i}
                    className="text-center text-xs font-semibold text-neutral-500 py-2 uppercase"
                >
                    {format(addDays(weekStart, i), dateFormat, { locale: es })}
                </div>
            );
        }
        return <div className="grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const currentDay = day;
                const dayEvents = getEventsForDate(currentDay);
                const isCurrentMonth = isSameMonth(currentDay, monthStart);
                const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
                const isTodayDate = isToday(currentDay);
                const isWeekendDay = isWeekend(currentDay);

                days.push(
                    <motion.div
                        key={currentDay.toString()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDateClick(currentDay)}
                        className={`
                            relative min-h-[80px] p-1 border border-neutral-100 cursor-pointer transition-colors
                            ${!isCurrentMonth ? 'bg-neutral-50 opacity-50' : 'bg-white hover:bg-neutral-50'}
                            ${isSelected ? 'ring-2 ring-green-500 ring-inset' : ''}
                            ${isTodayDate ? 'bg-green-50' : ''}
                            ${isWeekendDay && isCurrentMonth ? 'bg-neutral-50/70' : ''}
                        `}
                    >
                        <div className={`
                            text-sm font-medium mb-1 flex items-center justify-center w-6 h-6 rounded-full
                            ${isTodayDate ? 'bg-green-600 text-white' : ''}
                            ${isWeekendDay && !isTodayDate ? 'text-neutral-400' : 'text-neutral-700'}
                        `}>
                            {format(currentDay, 'd')}
                        </div>

                        {/* Events */}
                        <div className="space-y-0.5">
                            {dayEvents.slice(0, 2).map((event) => {
                                const colors = eventColors[event.type];
                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick?.(event);
                                        }}
                                        className={`text-[10px] px-1 py-0.5 rounded truncate ${colors.bg} ${colors.text} cursor-pointer hover:opacity-80`}
                                    >
                                        {event.title}
                                    </motion.div>
                                );
                            })}
                            {dayEvents.length > 2 && (
                                <div className="text-[10px] text-neutral-500 px-1">
                                    +{dayEvents.length - 2} más
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7">
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-neutral-800">
                        {format(currentMonth, "MMMM yyyy", { locale: es })}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={prevMonth}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                        Hoy
                    </Button>
                    <Button variant="ghost" size="sm" onClick={nextMonth}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 p-3 border-b border-neutral-100 bg-neutral-50">
                {Object.entries(eventColors).map(([type, colors]) => (
                    <div key={type} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className="text-xs text-neutral-600">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="p-2">
                {renderDays()}
                {renderCells()}
            </div>

            {/* Selected Date Info */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-neutral-200 p-4 bg-neutral-50"
                    >
                        <h3 className="font-medium text-neutral-800 mb-2">
                            {format(selectedDate, "EEEE, d MMMM yyyy", { locale: es })}
                        </h3>
                        {getEventsForDate(selectedDate).length > 0 ? (
                            <div className="space-y-2">
                                {getEventsForDate(selectedDate).map(event => {
                                    const colors = eventColors[event.type];
                                    return (
                                        <div
                                            key={event.id}
                                            className={`p-2 rounded-lg ${colors.bg} border border-opacity-20`}
                                        >
                                            <p className={`font-medium ${colors.text}`}>{event.title}</p>
                                            {event.empleadoNombre && (
                                                <p className="text-sm text-neutral-600">{event.empleadoNombre}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">No hay eventos para este día</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
