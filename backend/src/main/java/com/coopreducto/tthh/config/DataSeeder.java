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
import java.math.RoundingMode;
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
        private final NotificacionRepository notificacionRepository;
        private final PasswordEncoder passwordEncoder;
        private final FraseDelDiaService fraseDelDiaService;
        private final com.coopreducto.tthh.repository.ModuloRepository moduloRepository;

        @Bean
        public CommandLineRunner initData() {
                return args -> {
                        try {
                                log.info("🚀 INICIANDO SINCRONIZACIÓN ROBUSTA DE DATOS (CMR 8 NÓMINA + SEGURIDAD EMAIL)...");

                                // 1. Módulos y Roles
                                crearModulosSistema();
                                ensureRoles();

                                Rol rolTthh = rolRepository.findByNombre("TTHH").orElseThrow();
                                Rol rolColaborador = rolRepository.findByNombre("COLABORADOR").orElseThrow();
                                Rol rolCmr = rolRepository.findByNombre("ADMIN_CMR").orElse(rolTthh);

                                // 2. Sincronizar Empleados y Usuarios uno por uno
                                synchronizedSymmetry(rolTthh, rolColaborador, rolCmr);

                                List<Empleado> todosLosEmpleados = empleadoRepository.findAll();

                                // 4. Datos Transaccionales
                                if (solicitudRepository.count() < 50) {
                                        crearSolicitudes(todosLosEmpleados);
                                }
                                if (ausenciaRepository.count() < 10) {
                                        crearAusencias(todosLosEmpleados);
                                }

                                // 5. Recibos para Admin
                                Empleado admin = empleadoRepository.findByNumeroDocumento("4328485").orElse(null);
                                if (admin != null && reciboSalarioRepository.countByEmpleado(admin) < 12) {
                                        generarRecibosCompletos2025(admin);
                                }

                                // 6. Comisiones
                                if (reciboComisionRepository.count() == 0) {
                                        for (Empleado e : todosLosEmpleados) {
                                                if (e.getArea().contains("CREDITO")
                                                                || e.getArea().equals("JUDICIALES")) {
                                                        generarComisionesPrueba(e);
                                                }
                                        }
                                }

                                // 7. Misceláneos
                                if (notificacionRepository.count() == 0) {
                                        crearNotificaciones();
                                }
                                fraseDelDiaService.inicializarFrasesDefault();

                                log.info("✅ SINCRONIZACIÓN FINALIZADA CON ÉXITO.");
                        } catch (Exception e) {
                                log.error("❌ ERROR CRÍTICO EN EL SEEDER: ", e);
                        }
                };
        }

        private void synchronizedSymmetry(Rol tthh, Rol colab, Rol cmr) {
                // Admin - Usar email EXACTO para evitar UK violation
                ensureEmpAndUser("4328485", "S-1024", "Victor Ariel", "Maldonado Martinez", "TTHH",
                                "Jefe de Talento Humano", "15000000", "CASA MATRIZ", "INDEFERIDO", tthh,
                                "admin.tthh@coopreducto.com.py");

                // CMR 8 Colaboradores en Nómina
                ensureEmpAndUser("C-001", "S-9001", "Ana", "López", "ADMINISTRACION", "Secretaria CMR", "3500000",
                                "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);
                ensureEmpAndUser("C-002", "S-9002", "Pedro", "García", "MANTENIMIENTO", "Limpieza CMR", "3000000",
                                "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);
                ensureEmpAndUser("C-003", "S-9003", "Marta", "Rojas", "RECEPCION", "Recepcionista CMR", "3200000",
                                "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);
                ensureEmpAndUser("C-004", "S-9004", "Luis", "Sosa", "ADMINISTRACION", "Asistente Contable CMR",
                                "4000000", "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);
                ensureEmpAndUser("C-005", "S-9005", "Carmen", "Duarte", "RECEPCION", "Recepcionista Turno Tarde",
                                "3200000", "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);
                ensureEmpAndUser("C-006", "S-9006", "Jorge", "Benitez", "MANTENIMIENTO", "Seguridad CMR", "3500000",
                                "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);
                ensureEmpAndUser("C-007", "S-9007", "Sofia", "Mendoza", "ADMINISTRACION", "Coordinadora CMR", "5500000",
                                "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);
                ensureEmpAndUser("C-008", "S-9008", "Raul", "Ortiz", "ADMINISTRACION", "Encargado de Farmacia CMR",
                                "4500000", "CENTRO MEDICO REDUCTO", "INDEFERIDO", cmr, null);

                // CMR Profesionales (Pago factura)
                ensureEmpAndUser("P-001", "F-001", "Dr. Hugo", "Zárate", "SALUD", "Médico", "0",
                                "CENTRO MEDICO REDUCTO", "PRESTADOR_SERVICIOS", cmr, null);
                ensureEmpAndUser("P-002", "F-002", "Lic. Elena", "Benítez", "SALUD", "Enfermera", "0",
                                "CENTRO MEDICO REDUCTO", "PRESTADOR_SERVICIOS", cmr, null);
                ensureEmpAndUser("P-003", "F-003", "Dr. Ricardo", "Silva", "SALUD", "Psicólogo", "0",
                                "CENTRO MEDICO REDUCTO", "PRESTADOR_SERVICIOS", cmr, null);
                ensureEmpAndUser("P-004", "F-004", "Lic. Silvia", "Meza", "SALUD", "Terapeuta", "0",
                                "CENTRO MEDICO REDUCTO", "PRESTADOR_SERVICIOS", cmr, null);

                // Otros
                if (empleadoRepository.count() < 35) {
                        for (int i = 0; i < 10; i++) {
                                ensureEmpAndUser("GEN-" + i, "S-" + (5000 + i), "Empleado_" + i, "Test_" + i, "VENTAS",
                                                "Asesor", "3500000", "CASA MATRIZ", "INDEFERIDO", colab, null);
                        }
                }
        }

        private void ensureEmpAndUser(String ci, String socio, String n, String a, String area, String cargo,
                        String sal, String suc, String tipo, Rol rol, String forcedEmail) {
                Empleado e = empleadoRepository.findByNumeroDocumento(ci).orElseGet(() -> {
                        Empleado newE = new Empleado();
                        newE.setNumeroDocumento(ci);
                        newE.setNombres(n);
                        newE.setApellidos(a);
                        newE.setNumeroSocio(socio);
                        newE.setArea(area);
                        newE.setCargo(cargo);
                        newE.setSalario(new BigDecimal(sal));
                        newE.setSucursal(suc);
                        newE.setTipoContrato(tipo);
                        newE.setEstado("ACTIVO");
                        String baseEmail = (forcedEmail != null) ? forcedEmail
                                        : n.toLowerCase().replace(" ", "").replace(".", "") + "." + ci
                                                        + "@coopreducto.com.py";
                        newE.setEmail(baseEmail);
                        newE.setFechaIngreso(LocalDate.now().minusYears(1));
                        newE.setFechaNacimiento(LocalDate.of(1985, 5, 20));
                        newE.setCreatedAt(LocalDateTime.now());
                        newE.setUpdatedAt(LocalDateTime.now());
                        return empleadoRepository.save(newE);
                });

                String username = ci.equals("4328485") ? "admin" : e.getEmail().split("@")[0];
                if (usuarioRepository.findByUsername(username).isEmpty()
                                && !usuarioRepository.existsByEmail(e.getEmail())) {
                        Usuario u = new Usuario();
                        u.setUsername(username);
                        u.setNombres(e.getNombres());
                        u.setApellidos(e.getApellidos());
                        u.setEmail(e.getEmail());
                        u.setPassword(passwordEncoder.encode("admin123"));
                        u.setRol(rol);
                        u.setEmpleado(e);
                        u.setEstado("ACTIVO");
                        u.setCreatedAt(LocalDateTime.now());
                        u.setUpdatedAt(LocalDateTime.now());
                        usuarioRepository.save(u);
                }
        }

        private void ensureRoles() {
                crearRol("TTHH", "Talento Humano", "{\"all\":\"full\"}");
                crearRol("GERENCIA", "Gerencia", "{\"all\":\"read\"}");
                crearRol("COLABORADOR", "Colaborador", "{\"perfil\":\"full\",\"solicitudes\":\"own\"}");
                crearRol("ADMIN_CMR", "Administrador Centro Médico", "{\"cmr\":\"full\",\"perfil\":\"full\"}");
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
                r.setUpdatedAt(LocalDateTime.now());
                rolRepository.save(r);
        }

        private void generarComisionesPrueba(Empleado e) {
                for (int m = 11; m <= 12; m++) {
                        ReciboComision rc = new ReciboComision();
                        rc.setEmpleado(e);
                        rc.setAnio(2024);
                        rc.setMes(m);
                        rc.setProduccionMensual(new BigDecimal("15000000"));
                        rc.setMontoComision(new BigDecimal("750000"));
                        rc.setMetaAlcanzadaPorcentaje(new BigDecimal("100"));
                        rc.setEstado("GENERADO");
                        rc.setCreatedAt(LocalDateTime.now());
                        reciboComisionRepository.save(rc);
                }
        }

        private void crearSolicitudes(List<Empleado> emps) {
                Random r = new Random();
                for (int i = 0; i < 50; i++) {
                        if (emps.isEmpty())
                                break;
                        Empleado e = emps.get(r.nextInt(emps.size()));
                        Solicitud s = new Solicitud();
                        s.setEmpleado(e);
                        s.setTipo("PERMISO");
                        s.setTitulo("Solicitud " + i);
                        s.setDescripcion("Generada automáticamente");
                        s.setEstado("PENDIENTE");
                        s.setCreatedAt(LocalDateTime.now().minusDays(i));
                        solicitudRepository.save(s);
                }
        }

        private void crearAusencias(List<Empleado> emps) {
                for (int i = 0; i < 10; i++) {
                        if (emps.size() <= i)
                                break;
                        Empleado e = emps.get(i % emps.size());
                        Ausencia a = new Ausencia();
                        a.setEmpleado(e);
                        a.setTipo("VACACIONES");
                        a.setFechaInicio(LocalDate.now().plusWeeks(i + 1));
                        a.setFechaFin(LocalDate.now().plusWeeks(i + 1).plusDays(5));
                        a.setEstado("PENDIENTE");
                        a.setCreatedAt(LocalDateTime.now());
                        ausenciaRepository.save(a);
                }
        }

        private void crearModulosSistema() {
                List<Modulo> modulosDefinidos = List.of(
                                new Modulo("DASHBOARD", "Dashboard", "Inicio", "LayoutDashboard", "/dashboard", 1,
                                                true),
                                new Modulo("PERFIL", "Mi Perfil", "Mis datos", "User", "/colaborador/perfil", 2, true),
                                new Modulo("CMR", "Centro Médico (C.M.R)", "Gestión de profesionales y servicios",
                                                "Stethoscope", "/admin/cmr", 20, false),
                                new Modulo("ADMIN_EMPLEADOS", "Empleados", "Gestión RRHH", "Users", "/admin/empleados",
                                                3, false));
                for (Modulo def : modulosDefinidos) {
                        moduloRepository.findByCodigo(def.getCodigo()).ifPresentOrElse(
                                        ex -> {
                                                ex.setNombre(def.getNombre());
                                                ex.setIcono(def.getIcono());
                                                ex.setRutaMenu(def.getRutaMenu());
                                                moduloRepository.save(ex);
                                        },
                                        () -> moduloRepository.save(def));
                }
        }

        private void crearNotificaciones() {
                for (Usuario u : usuarioRepository.findAll()) {
                        Notificacion n = new Notificacion();
                        n.setUsuarioId(u.getId());
                        n.setTitulo("Bienvenido");
                        n.setMensaje("El sistema ha sido actualizado.");
                        n.setTipo("SISTEMA");
                        n.setCreatedAt(LocalDateTime.now());
                        notificacionRepository.save(n);
                }
        }

        private void generarRecibosCompletos2025(Empleado e) {
                for (int m = 1; m <= 12; m++) {
                        ReciboSalario r = new ReciboSalario();
                        r.setEmpleado(e);
                        r.setAnio(2025);
                        r.setMes(m);
                        r.setSalarioBruto(e.getSalario());
                        r.setSalarioNeto(e.getSalario().multiply(new BigDecimal("0.91")));
                        r.setEstado("GENERADO");
                        r.setFechaPago(LocalDate.of(2025, m, 28));
                        r.setCreatedAt(LocalDateTime.now());
                        reciboSalarioRepository.save(r);
                }
        }
}
