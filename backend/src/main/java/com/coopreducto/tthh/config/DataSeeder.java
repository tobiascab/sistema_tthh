package com.coopreducto.tthh.config;

import com.coopreducto.tthh.entity.*;
import com.coopreducto.tthh.repository.*;
import com.coopreducto.tthh.service.FraseDelDiaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Configuration
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DataSeeder {

        private final EmpleadoRepository empleadoRepository;
        private final SolicitudRepository solicitudRepository;
        private final AusenciaRepository ausenciaRepository;
        private final RolRepository rolRepository;
        private final UsuarioRepository usuarioRepository;
        private final ReciboSalarioRepository reciboSalarioRepository;
        private final ReciboComisionRepository reciboComisionRepository;
        private final PasswordEncoder passwordEncoder;
        private final FraseDelDiaService fraseDelDiaService;
        private final com.coopreducto.tthh.repository.ModuloRepository moduloRepository;

        @Bean
        public CommandLineRunner initData() {
                return args -> {
                        try {
                                log.info("🚀 INICIANDO POBLADO MASIVO Y LIMPIO DE DATOS...");

                                // 1.5 Módulos del Sistema
                                crearModulosSistema();

                                if (empleadoRepository.count() > 0) {
                                        log.info("⚠️ Los datos ya existen. Saltando poblado masivo para evitar duplicados.");
                                        return;
                                }

                                // 1. Roles
                                ensureRoles();
                                Rol rolTthh = rolRepository.findByNombre("TTHH").orElseThrow();
                                Rol rolColaborador = rolRepository.findByNombre("COLABORADOR").orElseThrow();

                                // 2. Empleados y Usuarios
                                List<Empleado> empleados = createEmployees();

                                // 3. Generar Usuarios para todos
                                createUsers(empleados, rolTthh, rolColaborador);

                                // 4. Datos Transaccionales
                                crearSolicitudes(empleados);
                                crearAusencias(empleados);

                                // 5. Recibos para el admin (Victor Maldonado)
                                Empleado admin = empleadoRepository.findByNumeroDocumento("4328485").orElse(null);
                                if (admin != null) {
                                        generarRecibosAnuales(admin, 2024);
                                        generarRecibosAnuales(admin, 2025);
                                }

                                // 6. Frases del día
                                fraseDelDiaService.inicializarFrasesDefault();

                                log.info("✅ PROCESO DE CARGA COMPLETADO: 50+ Empleados registrados.");
                        } catch (Exception e) {
                                log.error("❌ ERROR EN EL SEEDER: ", e);
                        }
                };

        }

        private void ensureRoles() {
                if (rolRepository.count() >= 4)
                        return;

                crearRol("TTHH", "Talento Humano",
                                "{\"empleados\":\"full\",\"usuarios\":\"full\",\"reportes\":\"full\"}");
                crearRol("GERENCIA", "Gerencia",
                                "{\"empleados\":\"read\",\"reportes\":\"full\",\"aprobaciones\":\"full\"}");
                crearRol("AUDITORIA", "Auditoría",
                                "{\"empleados\":\"read\",\"auditoria\":\"full\",\"reportes\":\"read\"}");
                crearRol("COLABORADOR", "Colaborador", "{\"perfil\":\"full\",\"solicitudes\":\"own\"}");
                crearRol("ASESOR_DE_CREDITO", "Asesor de Crédito", "{\"perfil\":\"full\",\"comisiones\":\"own\"}");
                crearRol("JUDICIAL", "Judicial", "{\"perfil\":\"full\",\"comisiones\":\"own\"}");
                crearRol("RECUPERADOR_DE_CREDITO", "Recuperador de Crédito",
                                "{\"perfil\":\"full\",\"comisiones\":\"own\"}");
        }

        private void crearRol(String nombre, String desc, String permisos) {
                if (rolRepository.findByNombre(nombre).isPresent())
                        return;
                Rol r = new Rol();
                r.setNombre(nombre);
                r.setDescripcion(desc);
                r.setPermisos(permisos);
                r.setActivo(true);
                r.setCreatedAt(LocalDateTime.now());
                rolRepository.save(r);
        }

        private List<Empleado> createEmployees() {
                List<Empleado> list = new ArrayList<>();

                // Empleados principales obligatorios
                list.add(saveEmp("4328485", "S-1024", "Victor Ariel", "Maldonado Martinez", "TTHH",
                                "Jefe de Talento Humano", "15000000", "CASA MATRIZ"));
                list.add(saveEmp("3344556", "S-2045", "Juan Carlos", "Pérez Gomez", "CREDITO", "Analista de Créditos",
                                "4500000", "SUCURSAL 5"));
                list.add(saveEmp("5566778", "S-3012", "María Fernanda", "González", "AHORRO", "Ejecutiva de Ahorro",
                                "5500000", "SUCURSAL SAN LORENZO CENTRO"));

                String[] sucursales = { "CASA MATRIZ", "SUCURSAL 5", "SUCURSAL SAN LORENZO CENTRO",
                                "SUCURSAL HERNANDARIAS", "SUCURSAL CIUDAD DEL ESTE" };
                String[] depto = { "TARJETA", "TESORERIA", "INFORMATICA", "JUDICIALES", "CONTABILIDAD" };

                for (int i = 0; i < 50; i++) {
                        String s = sucursales[i % sucursales.length];
                        String d = depto[i % depto.length];
                        list.add(saveEmp("CI-" + (5000000 + i), "S-" + (4000 + i), "Empleado_" + i, "Test_" + i, d,
                                        "Asistente " + d, "3500000", s));
                }
                return list;
        }

        private Empleado saveEmp(String ci, String socio, String n, String a, String area, String cargo, String sal,
                        String suc) {
                Empleado e = new Empleado();
                e.setNumeroDocumento(ci);
                e.setNombres(n);
                e.setApellidos(a);
                e.setNumeroSocio(socio);
                e.setArea(area);
                e.setCargo(cargo);
                e.setSalario(new BigDecimal(sal));
                e.setSucursal(suc);
                e.setEstado("ACTIVO");
                e.setEmail(n.toLowerCase().replace(" ", "") + "." + ci + "@coopreducto.com.py");
                e.setFechaIngreso(LocalDate.now().minusYears(2));
                e.setFechaNacimiento(LocalDate.of(1990, 1, 1));
                e.setCreatedAt(LocalDateTime.now());
                return empleadoRepository.save(e);
        }

        private void createUsers(List<Empleado> emps, Rol tthh, Rol colab) {
                Rol rolAsesor = rolRepository.findByNombre("ASESOR_DE_CREDITO").orElse(colab);
                Rol rolJudicial = rolRepository.findByNombre("JUDICIAL").orElse(colab);
                Rol rolRecuperador = rolRepository.findByNombre("RECUPERADOR_DE_CREDITO").orElse(colab);

                for (Empleado e : emps) {
                        Usuario u = new Usuario();
                        u.setUsername(e.getNumeroDocumento().equals("4328485") ? "admin" : e.getEmail().split("@")[0]);
                        u.setNombres(e.getNombres());
                        u.setApellidos(e.getApellidos());
                        u.setEmail(e.getEmail());
                        u.setPassword(passwordEncoder.encode("admin123"));

                        Rol roleToAssign = colab;
                        if (e.getArea().equals("TTHH"))
                                roleToAssign = tthh;
                        else if (e.getCargo().contains("Crédito"))
                                roleToAssign = rolAsesor;
                        else if (e.getArea().equals("JUDICIALES"))
                                roleToAssign = rolJudicial;
                        else if (e.getCargo().contains("Recuperador"))
                                roleToAssign = rolRecuperador;

                        u.setRol(roleToAssign);
                        u.setEmpleado(e);
                        u.setEstado("ACTIVO");
                        u.setCreatedAt(LocalDateTime.now());
                        usuarioRepository.save(u);

                        // Generar comisiones si tiene rol de ventas/recupero
                        if (roleToAssign != colab && roleToAssign != tthh) {
                                generarComisionesPrueba(e);
                        }
                }
        }

        private void generarComisionesPrueba(Empleado e) {
                for (int m = 10; m <= 12; m++) {
                        ReciboComision rc = new ReciboComision();
                        rc.setEmpleado(e);
                        rc.setAnio(2024);
                        rc.setMes(m);
                        rc.setFechaPago(LocalDate.of(2024, m, 15));

                        BigDecimal produccion = new BigDecimal(10000000 + (new Random().nextInt(5000000)));
                        rc.setProduccionMensual(produccion);
                        rc.setMontoComision(produccion.multiply(new BigDecimal("0.05"))); // 5% comision
                        rc.setMetaAlcanzadaPorcentaje(new BigDecimal("100"));
                        rc.setEstado("GENERADO");
                        rc.setCreatedAt(LocalDateTime.now());
                        reciboComisionRepository.save(rc);
                }
        }

        private void crearSolicitudes(List<Empleado> emps) {
                Random r = new Random();
                String[] tipos = { "VACACIONES", "PERMISO", "CONSTANCIA_LABORAL", "ANTICIPO_SALARIO" };
                for (int i = 0; i < 100; i++) {
                        Empleado e = emps.get(r.nextInt(emps.size()));
                        Solicitud s = new Solicitud();
                        s.setEmpleado(e);
                        s.setTipo(tipos[i % tipos.length]);
                        s.setTitulo("Solicitud de " + s.getTipo());
                        s.setDescripcion("Descripción de prueba para " + e.getNombreCompleto());
                        s.setEstado("PENDIENTE");
                        s.setPrioridad("MEDIA");
                        s.setCreatedAt(LocalDateTime.now().minusDays(r.nextInt(30)));
                        solicitudRepository.save(s);
                }
        }

        private void crearAusencias(List<Empleado> emps) {
                Random r = new Random();
                for (int i = 0; i < 20; i++) {
                        Empleado e = emps.get(r.nextInt(emps.size()));
                        Ausencia a = new Ausencia();
                        a.setEmpleado(e);
                        a.setTipo("VACACIONES");
                        a.setFechaInicio(LocalDate.now().plusDays(r.nextInt(15)));
                        a.setFechaFin(a.getFechaInicio().plusDays(2));
                        a.setEstado("PENDIENTE");
                        a.setCreatedAt(LocalDateTime.now());
                        ausenciaRepository.save(a);
                }
        }

        private void generarRecibosAnuales(Empleado e, int anio) {
                for (int m = 11; m <= 12; m++) {
                        ReciboSalario res = new ReciboSalario();
                        res.setEmpleado(e);
                        res.setAnio(anio);
                        res.setMes(m);
                        res.setSalarioBruto(e.getSalario());
                        res.setBonificaciones(new BigDecimal("2000000"));
                        res.setDescuentosIps(e.getSalario().multiply(new BigDecimal("0.09")));
                        res.setSalarioNeto(
                                        e.getSalario().add(res.getBonificaciones()).subtract(res.getDescuentosIps()));
                        res.setEstado("GENERADO");
                        res.setFechaPago(LocalDate.of(anio, m, 28));
                        reciboSalarioRepository.save(res);
                }
        }

        private void crearModulosSistema() {
                log.info("📦 Sincronizando módulos del sistema...");

                List<Modulo> modulosDefinidos = List.of(
                                new Modulo("DASHBOARD", "Dashboard Principal",
                                                "Vista general del colaborador con estadísticas y accesos rápidos",
                                                "LayoutDashboard", "/dashboard", 1, true),

                                new Modulo("PERFIL", "Mi Perfil",
                                                "Visualización y edición de datos personales del colaborador",
                                                "User", "/colaborador/perfil", 2, true),

                                new Modulo("SOLICITUDES", "Mis Solicitudes",
                                                "Gestión de solicitudes de permisos, certificados y otros",
                                                "FileText", "/colaborador/solicitudes", 3, true),

                                new Modulo("AUSENCIAS", "Gestión de Ausencias",
                                                "Calendario y solicitud de vacaciones, licencias médicas, etc.",
                                                "Calendar", "/colaborador/ausencias", 4, true),

                                new Modulo("RECIBOS_SALARIO", "Recibos de Salario",
                                                "Consulta y descarga de recibos de sueldo mensuales",
                                                "Receipt", "/colaborador/recibos", 5, true),

                                new Modulo("COMISIONES", "Mis Comisiones",
                                                "Consulta de liquidaciones de comisiones (solo para asesores)",
                                                "DollarSign", "/colaborador/comisiones", 6, false),

                                new Modulo("MARCACIONES", "Mis Marcaciones",
                                                "Historial de asistencia y marcaciones de entrada/salida",
                                                "Clock", "/colaborador/marcaciones", 7, true),

                                new Modulo("DOCUMENTOS", "Mis Documentos",
                                                "Contratos, certificados y otros documentos personales",
                                                "FolderOpen", "/colaborador/documentos", 8, true),

                                // Módulos Administrativos
                                new Modulo("ADMIN_EMPLEADOS", "Gestión de Empleados",
                                                "Administración completa de empleados (solo Admin/TTHH)",
                                                "Users", "/admin/empleados", 10, false),

                                new Modulo("ADMIN_NOMINA", "Gestión de Nómina",
                                                "Procesamiento de nómina y recibos (solo Admin/TTHH)",
                                                "Banknote", "/admin/nomina", 11, false),

                                new Modulo("ADMIN_REPORTES", "Reportes Globales",
                                                "Reportes y estadísticas del sistema (solo Admin/TTHH)",
                                                "BarChart3", "/admin/reportes", 12, false),

                                new Modulo("ADMIN_ROLES", "Gestión de Roles y Permisos",
                                                "Administración de roles y permisos modulares (solo Admin/TTHH)",
                                                "Shield", "/admin/roles", 13, false));

                for (Modulo def : modulosDefinidos) {
                        moduloRepository.findByCodigo(def.getCodigo()).ifPresentOrElse(
                                        existente -> {
                                                existente.setEsDefault(def.getEsDefault());
                                                existente.setNombre(def.getNombre());
                                                existente.setRutaMenu(def.getRutaMenu());
                                                existente.setIcono(def.getIcono());
                                                moduloRepository.save(existente);
                                        },
                                        () -> moduloRepository.save(def));
                }

                log.info("✅ Módulos del sistema sincronizados.");
        }
}
