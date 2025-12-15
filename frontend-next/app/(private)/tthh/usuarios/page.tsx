'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Plus,
    Search,
    Shield,
    Ban,
    CheckCircle,
    XCircle,
    Key,
    MoreVertical,
    Edit,
    Trash2,
    UserCheck,
    UserX,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/src/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import { Label } from '@/src/components/ui/label';
import { useToast } from '@/src/components/ui/use-toast';
import { usuariosApi, rolesApi, Usuario, Rol, CreateUsuarioData } from '@/src/lib/api/usuariosApi';

const estadoColors: Record<string, string> = {
    ACTIVO: 'bg-green-500/10 text-green-500 border-green-500/20',
    INACTIVO: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    BLOQUEADO: 'bg-red-500/10 text-red-500 border-red-500/20',
    PENDIENTE: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRol, setFilterRol] = useState<string>('todos');
    const [filterEstado, setFilterEstado] = useState<string>('todos');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [formData, setFormData] = useState<CreateUsuarioData>({
        username: '',
        email: '',
        password: '',
        nombres: '',
        apellidos: '',
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usuariosData, rolesData] = await Promise.all([
                usuariosApi.getAll(),
                rolesApi.getAll(),
            ]);
            setUsuarios(usuariosData);
            setRoles(rolesData);
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudieron cargar los datos', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await usuariosApi.create(formData);
            toast({ title: 'Éxito', description: 'Usuario creado correctamente' });
            setIsCreateOpen(false);
            setFormData({ username: '', email: '', password: '', nombres: '', apellidos: '' });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'No se pudo crear el usuario', variant: 'destructive' });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar este usuario?')) return;
        try {
            await usuariosApi.delete(id);
            toast({ title: 'Éxito', description: 'Usuario eliminado' });
            fetchData();
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudo eliminar', variant: 'destructive' });
        }
    };

    const handleActivar = async (id: number) => {
        await usuariosApi.activar(id);
        toast({ title: 'Usuario activado' });
        fetchData();
    };

    const handleDesactivar = async (id: number) => {
        await usuariosApi.desactivar(id);
        toast({ title: 'Usuario desactivado' });
        fetchData();
    };

    const handleBloquear = async (id: number) => {
        await usuariosApi.bloquear(id);
        toast({ title: 'Usuario bloqueado' });
        fetchData();
    };

    const handleDesbloquear = async (id: number) => {
        await usuariosApi.desbloquear(id);
        toast({ title: 'Usuario desbloqueado' });
        fetchData();
    };

    const handleResetPassword = async (id: number) => {
        await usuariosApi.resetearPassword(id);
        toast({ title: 'Contraseña reseteada' });
    };

    const handleEdit = (usuario: Usuario) => {
        setEditingUser(usuario);
        setFormData({
            username: usuario.username,
            email: usuario.email,
            password: '', // Don't pre-fill password
            nombres: usuario.nombres || '',
            apellidos: usuario.apellidos || '',
            rolId: usuario.rolId ?? undefined, // Convert null to undefined for type compatibility
        });
        setIsEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        try {
            // Only send fields that changed
            const updateData: any = {
                username: formData.username,
                email: formData.email,
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                rolId: formData.rolId,
            };
            // Only include password if it was changed
            if (formData.password) {
                updateData.password = formData.password;
            }
            await usuariosApi.update(editingUser.id, updateData);
            toast({ title: 'Éxito', description: 'Usuario actualizado correctamente' });
            setIsEditOpen(false);
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', nombres: '', apellidos: '' });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'No se pudo actualizar el usuario', variant: 'destructive' });
        }
    };

    const filteredUsuarios = usuarios.filter((u) => {
        const matchSearch =
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRol = filterRol === 'todos' || u.rolId?.toString() === filterRol;
        const matchEstado = filterEstado === 'todos' || u.estado === filterEstado;
        return matchSearch && matchRol && matchEstado;
    });

    return (
        <div className="container mx-auto py-6 px-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-muted-foreground">Administra usuarios y permisos del sistema</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                            <DialogDescription>Complete los datos del nuevo usuario</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombres</Label>
                                    <Input
                                        value={formData.nombres}
                                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Apellidos</Label>
                                    <Input
                                        value={formData.apellidos}
                                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Username *</Label>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contraseña *</Label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rol</Label>
                                <Select
                                    value={formData.rolId?.toString() || ''}
                                    onValueChange={(v) => setFormData({ ...formData, rolId: parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((rol) => (
                                            <SelectItem key={rol.id} value={rol.id.toString()}>
                                                {rol.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreate}>Crear Usuario</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Usuario Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                            <DialogDescription>Modifique los datos del usuario</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombres</Label>
                                    <Input
                                        value={formData.nombres}
                                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Apellidos</Label>
                                    <Input
                                        value={formData.apellidos}
                                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Username</Label>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nueva Contraseña (dejar vacío para no cambiar)</Label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Dejar vacío para mantener actual"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rol</Label>
                                <Select
                                    value={formData.rolId?.toString() || ''}
                                    onValueChange={(v) => setFormData({ ...formData, rolId: parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((rol) => (
                                            <SelectItem key={rol.id} value={rol.id.toString()}>
                                                {rol.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleUpdate}>Guardar Cambios</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <div className="flex items-center gap-3">
                        <UserCheck className="h-8 w-8 text-green-500" />
                        <div>
                            <p className="text-2xl font-bold">{usuarios.filter((u) => u.estado === 'ACTIVO').length}</p>
                            <p className="text-sm text-muted-foreground">Activos</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-500/5">
                    <div className="flex items-center gap-3">
                        <UserX className="h-8 w-8 text-gray-500" />
                        <div>
                            <p className="text-2xl font-bold">{usuarios.filter((u) => u.estado === 'INACTIVO').length}</p>
                            <p className="text-sm text-muted-foreground">Inactivos</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5">
                    <div className="flex items-center gap-3">
                        <Ban className="h-8 w-8 text-red-500" />
                        <div>
                            <p className="text-2xl font-bold">{usuarios.filter((u) => u.estado === 'BLOQUEADO').length}</p>
                            <p className="text-sm text-muted-foreground">Bloqueados</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-2xl font-bold">{usuarios.length}</p>
                            <p className="text-sm text-muted-foreground">Total</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar usuarios..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterRol} onValueChange={setFilterRol}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los roles</SelectItem>
                        {roles.map((rol) => (
                            <SelectItem key={rol.id} value={rol.id.toString()}>
                                {rol.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        <SelectItem value="ACTIVO">Activos</SelectItem>
                        <SelectItem value="INACTIVO">Inactivos</SelectItem>
                        <SelectItem value="BLOQUEADO">Bloqueados</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Users Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 font-medium">Usuario</th>
                                <th className="text-left p-4 font-medium">Email</th>
                                <th className="text-left p-4 font-medium">Rol</th>
                                <th className="text-left p-4 font-medium">Estado</th>
                                <th className="text-left p-4 font-medium">Último Acceso</th>
                                <th className="text-right p-4 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : filteredUsuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                        No se encontraron usuarios
                                    </td>
                                </tr>
                            ) : (
                                filteredUsuarios.map((usuario) => (
                                    <motion.tr
                                        key={usuario.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-primary font-semibold">
                                                        {usuario.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{usuario.username}</p>
                                                    <p className="text-sm text-muted-foreground">{usuario.nombreCompleto}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{usuario.email}</td>
                                        <td className="p-4">
                                            {usuario.rolNombre ? (
                                                <Badge variant="outline" className="gap-1">
                                                    <Shield className="h-3 w-3" />
                                                    {usuario.rolNombre}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <Badge className={`${estadoColors[usuario.estado]}`}>{usuario.estado}</Badge>
                                        </td>
                                        <td className="p-4 text-muted-foreground text-sm">
                                            {usuario.ultimoAcceso
                                                ? new Date(usuario.ultimoAcceso).toLocaleDateString()
                                                : 'Nunca'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleResetPassword(usuario.id)}>
                                                        <Key className="h-4 w-4 mr-2" />
                                                        Resetear Contraseña
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {usuario.estado === 'ACTIVO' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleDesactivar(usuario.id)}>
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Desactivar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleBloquear(usuario.id)}>
                                                                <Ban className="h-4 w-4 mr-2" />
                                                                Bloquear
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {usuario.estado === 'INACTIVO' && (
                                                        <DropdownMenuItem onClick={() => handleActivar(usuario.id)}>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Activar
                                                        </DropdownMenuItem>
                                                    )}
                                                    {usuario.estado === 'BLOQUEADO' && (
                                                        <DropdownMenuItem onClick={() => handleDesbloquear(usuario.id)}>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Desbloquear
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(usuario.id)}
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
