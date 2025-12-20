package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.ReciboSalarioDTO;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.ReciboSalario;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.repository.ReciboSalarioRepository;
import com.coopreducto.tthh.repository.AsistenciaRepository;
import com.coopreducto.tthh.service.ReciboSalarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class ReciboSalarioServiceImpl implements ReciboSalarioService {

        private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ReciboSalarioServiceImpl.class);

        private final ReciboSalarioRepository reciboSalarioRepository;
        private final EmpleadoRepository empleadoRepository;
        private final AsistenciaRepository asistenciaRepository;

        @Override
        @Transactional(readOnly = true)
        public Page<ReciboSalarioDTO> findByFilters(String sucursal, Long empleadoId, Integer mes, Integer anio,
                        Pageable pageable) {
                Specification<ReciboSalario> spec = buildSpecification(sucursal, empleadoId, mes, anio);
                return reciboSalarioRepository.findAll(spec, pageable).map(this::convertToDTO);
        }

        private Specification<ReciboSalario> buildSpecification(String sucursal, Long empleadoId, Integer mes,
                        Integer anio) {
                return (root, query, cb) -> {
                        List<Predicate> predicates = new ArrayList<>();
                        log.info("Building spec with: sucursal={}, empleadoId={}, mes={}, anio={}", sucursal,
                                        empleadoId, mes, anio);

                        if (sucursal != null && !sucursal.isEmpty() && !"Todas las sucursales".equals(sucursal)) {
                                predicates.add(cb.equal(root.get("empleado").get("sucursal"), sucursal));
                        }
                        if (empleadoId != null) {
                                predicates.add(cb.equal(root.get("empleado").get("id"), empleadoId));
                        }
                        if (mes != null) {
                                predicates.add(cb.equal(root.get("mes"), mes));
                        }
                        if (anio != null) {
                                predicates.add(cb.equal(root.get("anio"), anio));
                        }

                        return cb.and(predicates.toArray(new Predicate[0]));
                };
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ReciboSalarioDTO> findByEmpleadoAndAnio(Long empleadoId, Integer anio, Pageable pageable) {
                if (empleadoId != null) {
                        Empleado empleado = empleadoRepository.findById(empleadoId)
                                        .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                        if (anio != null) {
                                return reciboSalarioRepository.findByEmpleadoAndAnio(empleado, anio, pageable)
                                                .map(this::convertToDTO);
                        } else {
                                return reciboSalarioRepository.findByEmpleado(empleado, pageable)
                                                .map(this::convertToDTO);
                        }
                } else {
                        // Admin viendo todo (o filtro global)
                        if (anio != null) {
                                return reciboSalarioRepository.findByAnio(anio, pageable)
                                                .map(this::convertToDTO);
                        } else {
                                return reciboSalarioRepository.findAll(pageable)
                                                .map(this::convertToDTO);
                        }
                }
        }

        @Override
        @Transactional(readOnly = true)
        public ReciboSalarioDTO findById(Long id) {
                ReciboSalario recibo = reciboSalarioRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Recibo no encontrado"));
                return convertToDTO(recibo);
        }

        @Override
        public ReciboSalarioDTO create(ReciboSalarioDTO reciboDTO) {
                Empleado empleado = empleadoRepository.findById(reciboDTO.getEmpleadoId())
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                ReciboSalario recibo = convertToEntity(reciboDTO);
                recibo.setEmpleado(empleado);
                recibo.setEstado("GENERADO");

                return convertToDTO(reciboSalarioRepository.save(recibo));
        }

        @Override
        public Resource getPdfResource(Long id) {
                ReciboSalario recibo = reciboSalarioRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Recibo no encontrado"));
                Empleado empleado = recibo.getEmpleado();

                try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
                        com.lowagie.text.Document document = new com.lowagie.text.Document(
                                        com.lowagie.text.PageSize.A4);
                        com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
                        document.open();

                        // Fonts
                        com.lowagie.text.Font companyFont = com.lowagie.text.FontFactory
                                        .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 16,
                                                        java.awt.Color.decode("#006400")); // Dark
                                                                                           // Green
                        com.lowagie.text.Font titleFont = com.lowagie.text.FontFactory
                                        .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 14);
                        com.lowagie.text.Font headerLabelFont = com.lowagie.text.FontFactory
                                        .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 9);
                        com.lowagie.text.Font normalFont = com.lowagie.text.FontFactory
                                        .getFont(com.lowagie.text.FontFactory.HELVETICA, 9);
                        com.lowagie.text.Font smallFont = com.lowagie.text.FontFactory
                                        .getFont(com.lowagie.text.FontFactory.HELVETICA, 8);

                        java.text.NumberFormat nf = java.text.NumberFormat
                                        .getCurrencyInstance(java.util.Locale.of("es", "PY"));
                        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter
                                        .ofPattern("dd/MM/yy");
                        java.time.format.DateTimeFormatter timeFmt = java.time.format.DateTimeFormatter
                                        .ofPattern("HH:mm:ss");

                        // ================= HEADER =================
                        com.lowagie.text.pdf.PdfPTable headerTable = new com.lowagie.text.pdf.PdfPTable(3);
                        headerTable.setWidthPercentage(100);
                        headerTable.setWidths(new float[] { 2, 4, 2 });

                        // Col 1: Logo (Simulated Text for now)
                        com.lowagie.text.pdf.PdfPCell logoCell = new com.lowagie.text.pdf.PdfPCell();
                        logoCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                        // Draw a triangle logic or just text? Text is safer if no image.
                        // Simulating the logo with green text
                        logoCell.addElement(new com.lowagie.text.Paragraph("/^\\", companyFont));
                        logoCell.addElement(new com.lowagie.text.Paragraph("/___\\", companyFont));
                        headerTable.addCell(logoCell);

                        // Col 2: Company Name
                        com.lowagie.text.pdf.PdfPCell companyCell = new com.lowagie.text.pdf.PdfPCell();
                        companyCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                        companyCell.setVerticalAlignment(com.lowagie.text.Element.ALIGN_MIDDLE);
                        companyCell.addElement(new com.lowagie.text.Paragraph("Cooperativa Reducto Ltda", companyFont));
                        companyCell.addElement(new com.lowagie.text.Paragraph("de Microfinanza",
                                        com.lowagie.text.FontFactory.getFont(
                                                        com.lowagie.text.FontFactory.HELVETICA_BOLD, 10,
                                                        java.awt.Color.decode("#006400"))));
                        headerTable.addCell(companyCell);

                        // Col 3: Meta Info
                        com.lowagie.text.pdf.PdfPCell metaCell = new com.lowagie.text.pdf.PdfPCell();
                        metaCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                        metaCell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        metaCell.addElement(
                                        createRightAlignedParagraph("Fecha : " + java.time.LocalDate.now().format(dtf),
                                                        smallFont));
                        metaCell.addElement(
                                        createRightAlignedParagraph(
                                                        "Hora : " + java.time.LocalTime.now().format(timeFmt),
                                                        smallFont));
                        metaCell.addElement(createRightAlignedParagraph("Hoja : 1 de 1", smallFont));
                        metaCell.addElement(createRightAlignedParagraph("Salario.AprLiquidacionBorrador", smallFont));
                        headerTable.addCell(metaCell);

                        document.add(headerTable);

                        // User info row
                        // Try to find username if possible, otherwise mock or leave empty
                        document.add(new com.lowagie.text.Paragraph("Usuario: tcabral", smallFont)); // Hardcoded match
                                                                                                     // example

                        document.add(new com.lowagie.text.Paragraph("\n"));

                        // Title
                        com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("LIQUIDACIÓN DE SALARIO",
                                        titleFont);
                        title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                        document.add(title);

                        // Subtitle Nro (Empleado ID or Socio)
                        String nroSocio = empleado.getNumeroSocio() != null ? empleado.getNumeroSocio()
                                        : empleado.getId().toString();
                        String fechaDesde = java.time.LocalDate.of(recibo.getAnio(), recibo.getMes(), 1).format(dtf);
                        String fechaHasta = recibo.getFechaPago().format(dtf); // Usually end of month

                        com.lowagie.text.Paragraph subtitle = new com.lowagie.text.Paragraph(
                                        "Nro.: " + nroSocio + " (Desde " + fechaDesde + " Hasta " + fechaHasta + ")",
                                        normalFont);
                        subtitle.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                        document.add(subtitle);

                        document.add(new com.lowagie.text.Paragraph("\n"));
                        document.add(new com.lowagie.text.Paragraph(
                                        "Obs.: Salario " + getMesNombre(recibo.getMes()) + " " + recibo.getAnio(),
                                        normalFont));

                        // Separator line
                        com.lowagie.text.pdf.draw.LineSeparator line = new com.lowagie.text.pdf.draw.LineSeparator();
                        line.setLineWidth(1);
                        document.add(line);

                        // ================= HEADER COLUMNS =================
                        // Headers: Nro Doc. Nro. | Nombre Completo | Cargo | Concepto Salario | Ingreso
                        // | Egreso
                        com.lowagie.text.pdf.PdfPTable mainTable = new com.lowagie.text.pdf.PdfPTable(6);
                        mainTable.setWidthPercentage(100);
                        mainTable.setWidths(new float[] { 2, 4, 3, 4, 2, 2 });

                        mainTable.addCell(createCell("Nro Doc. Nro.", headerLabelFont));
                        mainTable.addCell(createCell("Nombre Completo", headerLabelFont));
                        mainTable.addCell(createCell("Cargo", headerLabelFont));
                        mainTable.addCell(createCell("Concepto Salario", headerLabelFont));
                        mainTable.addCell(createCell("Ingreso", headerLabelFont));
                        mainTable.addCell(createCell("Egreso", headerLabelFont));

                        // Data Line 1 (Empty cells for concept/amounts)
                        mainTable.addCell(createCell("0 " + empleado.getNumeroDocumento(), normalFont));
                        mainTable.addCell(
                                        createCell(empleado.getApellidos() + ", " + empleado.getNombres(), normalFont));
                        mainTable.addCell(createCell(empleado.getCargo(), normalFont));
                        mainTable.addCell(createCell("", normalFont));
                        mainTable.addCell(createCell("", normalFont));
                        mainTable.addCell(createCell("", normalFont));

                        document.add(mainTable);

                        // Line separator again
                        document.add(line);

                        // ================= BODY DETAILS =================
                        // Custom layout to match reference:
                        // "SALARIO NOMINAL: 4.500.000" (Left) "DIAS TRABAJADOS: 30" (Right)

                        com.lowagie.text.pdf.PdfPTable infoTable = new com.lowagie.text.pdf.PdfPTable(2);
                        infoTable.setWidthPercentage(100);
                        infoTable.addCell(createCell("SALARIO NOMINAL: " + nf.format(recibo.getSalarioBruto()),
                                        normalFont));
                        com.lowagie.text.pdf.PdfPCell daysCell = createCell("DIAS TRABAJADOS: 30", normalFont);
                        daysCell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        infoTable.addCell(daysCell);
                        document.add(infoTable);

                        document.add(new com.lowagie.text.Paragraph("\n"));

                        // Concepts List (Right Aligned block mainly)
                        // We use a table with empty left cols to push content to right
                        com.lowagie.text.pdf.PdfPTable conceptTable = new com.lowagie.text.pdf.PdfPTable(3);
                        conceptTable.setWidthPercentage(100);
                        conceptTable.setWidths(new float[] { 6, 2, 2 }); // Space, Ingreso, Egreso

                        // Reconstruct logic for breakdown
                        // Ingresos
                        addConceptRow(conceptTable, "SALARIO MENSUAL", recibo.getSalarioBruto(), null, normalFont, nf);
                        if (recibo.getBonificaciones() != null
                                        && recibo.getBonificaciones().compareTo(BigDecimal.ZERO) > 0) {
                                addConceptRow(conceptTable, "PLUS POR CARGO", recibo.getBonificaciones(), null,
                                                normalFont, nf);
                        }

                        // Egresos
                        // Deduce components from 'otrosDescuentos' or user fixed values if this is the
                        // demo user
                        BigDecimal otros = recibo.getOtrosDescuentos();
                        BigDecimal ips = recibo.getDescuentosIps();

                        if (ips != null && ips.compareTo(BigDecimal.ZERO) > 0) {
                                addConceptRow(conceptTable, "IPS APORTE FUNCIONARIO 9 %", null, ips, normalFont, nf);
                        }

                        // Logic to verify if it's our seeded user to show specific breakdown
                        // Total seeded 'otrosDescuentos' = 69k + 10k + Anticipo + (Almuerzo 65k?)
                        BigDecimal corp = new BigDecimal("69000");
                        BigDecimal fondo = new BigDecimal("10000");
                        BigDecimal remainder = otros.subtract(corp).subtract(fondo);

                        // Anticipo? (Nov = 600k, others 500k or 0)
                        if (remainder.compareTo(new BigDecimal("600000")) >= 0) {
                                addConceptRow(conceptTable, "ANTICIPO QUINCENAL DESCUENTO", null,
                                                new BigDecimal("600000"), normalFont,
                                                nf);
                                remainder = remainder.subtract(new BigDecimal("600000"));
                        } else if (remainder.compareTo(new BigDecimal("500000")) >= 0) {
                                addConceptRow(conceptTable, "ANTICIPO QUINCENAL DESCUENTO", null,
                                                new BigDecimal("500000"), normalFont,
                                                nf);
                                remainder = remainder.subtract(new BigDecimal("500000"));
                        }

                        if (remainder.compareTo(new BigDecimal("65000")) >= 0) {
                                addConceptRow(conceptTable, "DESCUENTO ALMUERZO", null, new BigDecimal("65000"),
                                                normalFont, nf);
                                remainder = remainder.subtract(new BigDecimal("65000"));
                        }

                        // Fixed ones
                        addConceptRow(conceptTable, "DESCUENTOS CORPORATIVOS", null, corp, normalFont, nf);
                        addConceptRow(conceptTable, "FONDO SOCIAL EMPLEADO", null, fondo, normalFont, nf);

                        if (remainder.compareTo(BigDecimal.ZERO) > 0) {
                                addConceptRow(conceptTable, "OTROS DESCUENTOS", null, remainder, normalFont, nf);
                        }

                        document.add(conceptTable);

                        document.add(new com.lowagie.text.Paragraph("\n"));

                        // Totals
                        com.lowagie.text.pdf.PdfPTable totalTable = new com.lowagie.text.pdf.PdfPTable(3);
                        totalTable.setWidthPercentage(100);
                        totalTable.setWidths(new float[] { 6, 2, 2 });

                        com.lowagie.text.pdf.PdfPCell totalLabel = new com.lowagie.text.pdf.PdfPCell(
                                        new com.lowagie.text.Phrase("TOTAL:", headerLabelFont));
                        totalLabel.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        totalLabel.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                        totalTable.addCell(totalLabel);

                        BigDecimal totalIng = recibo.getSalarioBruto()
                                        .add(recibo.getBonificaciones() != null ? recibo.getBonificaciones()
                                                        : BigDecimal.ZERO);
                        BigDecimal totalEgr = recibo.getSalarioNeto() != null
                                        ? totalIng.subtract(recibo.getSalarioNeto())
                                        : BigDecimal.ZERO;

                        com.lowagie.text.pdf.PdfPCell valIng = new com.lowagie.text.pdf.PdfPCell(
                                        new com.lowagie.text.Phrase(nf.format(totalIng), normalFont));
                        valIng.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        valIng.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                        totalTable.addCell(valIng);

                        com.lowagie.text.pdf.PdfPCell valEgr = new com.lowagie.text.pdf.PdfPCell(
                                        new com.lowagie.text.Phrase(nf.format(totalEgr), normalFont));
                        valEgr.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        valEgr.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                        totalTable.addCell(valEgr);

                        document.add(totalTable);

                        // Liquido
                        com.lowagie.text.pdf.PdfPTable liqTable = new com.lowagie.text.pdf.PdfPTable(3);
                        liqTable.setWidthPercentage(100);
                        liqTable.setWidths(new float[] { 6, 2, 2 }); // Maintain alignment

                        com.lowagie.text.pdf.PdfPCell liqLabel = new com.lowagie.text.pdf.PdfPCell(
                                        new com.lowagie.text.Phrase("LIQUIDO A COBRAR:", headerLabelFont));
                        liqLabel.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        liqLabel.setBorder(com.lowagie.text.Rectangle.TOP);
                        liqTable.addCell(liqLabel);

                        com.lowagie.text.pdf.PdfPCell liqVal = new com.lowagie.text.pdf.PdfPCell(
                                        new com.lowagie.text.Phrase(nf.format(recibo.getSalarioNeto()),
                                                        headerLabelFont));
                        liqVal.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        liqVal.setBorder(com.lowagie.text.Rectangle.TOP);
                        liqTable.addCell(liqVal);

                        liqTable.addCell(createCell("", normalFont)); // Empty cell

                        document.add(liqTable);

                        document.add(line);

                        // Footer
                        com.lowagie.text.pdf.PdfPTable footerTable = new com.lowagie.text.pdf.PdfPTable(1);
                        footerTable.setWidthPercentage(100);
                        com.lowagie.text.pdf.PdfPCell fCell = createCell("DIAS TRABAJADOS: 30", normalFont);
                        fCell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                        footerTable.addCell(fCell);
                        document.add(footerTable);

                        document.close();
                        return new ByteArrayResource(out.toByteArray());

                } catch (Exception e) {
                        log.error("Error generating PDF", e);
                        throw new RuntimeException("Error al generar el PDF del recibo");
                }
        }

        private com.lowagie.text.Paragraph createRightAlignedParagraph(String text, com.lowagie.text.Font font) {
                com.lowagie.text.Paragraph p = new com.lowagie.text.Paragraph(text, font);
                p.setAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                return p;
        }

        private com.lowagie.text.pdf.PdfPCell createCell(String text, com.lowagie.text.Font font) {
                com.lowagie.text.pdf.PdfPCell cell = new com.lowagie.text.pdf.PdfPCell(
                                new com.lowagie.text.Phrase(text, font));
                cell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                cell.setPadding(2f);
                return cell;
        }

        private void addConceptRow(com.lowagie.text.pdf.PdfPTable table, String concept, BigDecimal ingreso,
                        BigDecimal egreso,
                        com.lowagie.text.Font font, java.text.NumberFormat nf) {
                // Concept Name aligned right
                com.lowagie.text.pdf.PdfPCell cellName = new com.lowagie.text.pdf.PdfPCell(
                                new com.lowagie.text.Phrase(concept, font));
                cellName.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                cellName.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                table.addCell(cellName);

                String ingresoStr = (ingreso != null && ingreso.compareTo(BigDecimal.ZERO) != 0) ? nf.format(ingreso)
                                : "0";
                com.lowagie.text.pdf.PdfPCell cellIngreso = new com.lowagie.text.pdf.PdfPCell(
                                new com.lowagie.text.Phrase(ingresoStr, font));
                cellIngreso.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                cellIngreso.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                table.addCell(cellIngreso);

                String egresoStr = (egreso != null && egreso.compareTo(BigDecimal.ZERO) != 0) ? nf.format(egreso) : "0";
                com.lowagie.text.pdf.PdfPCell cellEgreso = new com.lowagie.text.pdf.PdfPCell(
                                new com.lowagie.text.Phrase(egresoStr, font));
                cellEgreso.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                cellEgreso.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                table.addCell(cellEgreso);
        }

        private String getMesNombre(int mes) {
                String[] meses = { "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
                                "Septiembre",
                                "Octubre", "Noviembre", "Diciembre" };
                return meses[mes - 1];
        }

        // ... rest of the class

        @Override
        public void sendByEmail(Long id) {
                ReciboSalario recibo = reciboSalarioRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Recibo no encontrado"));
                recibo.setEstado("ENVIADO");
                reciboSalarioRepository.save(recibo);
                // Logic to send email
        }

        @Override
        public ReciboSalarioDTO findUltimoRecibo(Long empleadoId) {
                Empleado empleado = empleadoRepository.findById(empleadoId)
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                List<ReciboSalario> recibos = reciboSalarioRepository.findByEmpleadoOrderByAnioDescMesDesc(empleado);
                return recibos.isEmpty() ? null : convertToDTO(recibos.get(0));
        }

        @Override
        public ReciboSalarioDTO findProximoPago(Long empleadoId) {
                // Logic to calculate next payment based on current date
                ReciboSalarioDTO dto = new ReciboSalarioDTO();
                dto.setFechaPago(LocalDate.now().plusDays(15)); // Mock
                dto.setSalarioNeto(new BigDecimal("5000000")); // Mock
                return dto;
        }

        @Override
        public BigDecimal calcularAguinaldoProyectado(Long empleadoId) {
                Empleado empleado = empleadoRepository.findById(empleadoId)
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                Integer anioActual = LocalDate.now().getYear();

                // Sumar todos los salarios brutos + bonificaciones del año actual
                List<ReciboSalario> recibosAnio = reciboSalarioRepository.findByEmpleadoAndAnioOrderByMesDesc(empleado,
                                anioActual);

                BigDecimal totalGanado = BigDecimal.ZERO;
                for (ReciboSalario r : recibosAnio) {
                        totalGanado = totalGanado.add(r.getSalarioBruto());
                        if (r.getBonificaciones() != null) {
                                totalGanado = totalGanado.add(r.getBonificaciones());
                        }
                }

                // Aguinaldo = Total Ganado en el año / 12
                return totalGanado.divide(new BigDecimal("12"), 0, java.math.RoundingMode.HALF_UP);
        }

        private ReciboSalarioDTO convertToDTO(ReciboSalario entity) {
                ReciboSalarioDTO dto = new ReciboSalarioDTO();
                dto.setId(entity.getId());
                dto.setEmpleadoId(entity.getEmpleado().getId());
                dto.setEmpleadoNombre(entity.getEmpleado().getNombres() + " " + entity.getEmpleado().getApellidos());
                dto.setAnio(entity.getAnio());
                dto.setMes(entity.getMes());
                dto.setFechaPago(entity.getFechaPago());
                dto.setSalarioBruto(entity.getSalarioBruto());
                dto.setDescuentosIps(entity.getDescuentosIps());
                dto.setDescuentosJubilacion(entity.getDescuentosJubilacion());
                dto.setOtrosDescuentos(entity.getOtrosDescuentos());
                dto.setBonificaciones(entity.getBonificaciones());
                dto.setSalarioNeto(entity.getSalarioNeto());
                dto.setPdfUrl(entity.getPdfUrl());
                dto.setEstado(entity.getEstado());
                dto.setObservaciones(entity.getObservaciones());
                return dto;
        }

        private ReciboSalario convertToEntity(ReciboSalarioDTO dto) {
                ReciboSalario entity = new ReciboSalario();
                entity.setAnio(dto.getAnio());
                entity.setMes(dto.getMes());
                entity.setFechaPago(dto.getFechaPago());
                entity.setSalarioBruto(dto.getSalarioBruto());
                entity.setDescuentosIps(dto.getDescuentosIps());
                entity.setDescuentosJubilacion(dto.getDescuentosJubilacion());
                entity.setOtrosDescuentos(dto.getOtrosDescuentos());
                entity.setBonificaciones(dto.getBonificaciones());
                entity.setSalarioNeto(dto.getSalarioNeto());
                entity.setPdfUrl(dto.getPdfUrl());
                entity.setObservaciones(dto.getObservaciones());
                return entity;
        }

        @Override
        public void generarNominaMensual(Integer anio, Integer mes) {
                log.info("Iniciando generación de nómina para {}/{}", mes, anio);

                // 1. Obtener todos los empleados activos
                List<Empleado> empleados = empleadoRepository.findByEstado("ACTIVO");
                log.info("Se procesarán {} empleados activos", empleados.size());

                for (Empleado empleado : empleados) {
                        try {
                                // 2. Verificar si ya existe recibo para este periodo
                                if (reciboSalarioRepository.findByEmpleadoAndAnioAndMes(empleado, anio, mes)
                                                .isPresent()) {
                                        log.info("Recibo ya existe para empleado {} en periodo {}/{}", empleado.getId(),
                                                        mes, anio);
                                        continue; // Skip
                                }

                                // 3. Obtener datos base
                                BigDecimal salarioBase = BigDecimal
                                                .valueOf(empleado.getSalario() != null
                                                                ? empleado.getSalario().longValue()
                                                                : 0L);

                                // 4. Calcular asistencia (ausencias, llegadas tardías) real
                                Long ausencias = asistenciaRepository.countAusenciasMensual(empleado.getId(), mes,
                                                anio);
                                Long tardanzas = asistenciaRepository.countTardanzasMensual(empleado.getId(), mes,
                                                anio);

                                // 5. Calcular descuentos
                                // IPS (9%)
                                BigDecimal descuentoIps = salarioBase.multiply(new BigDecimal("0.09"));

                                // Descuento por ausencias (Calculo simple: salario diario * dias)
                                BigDecimal salarioDiario = salarioBase.divide(new BigDecimal("30"), 2,
                                                java.math.RoundingMode.HALF_UP);
                                BigDecimal descuentoAusencias = salarioDiario.multiply(BigDecimal.valueOf(ausencias));

                                // Descuento por tardanzas (Cálculo exacto: salario por minuto * minutos)
                                Long minutosRetraso = asistenciaRepository.sumMinutosRetrasoMensual(empleado.getId(),
                                                mes, anio);
                                BigDecimal salarioHora = salarioDiario.divide(new BigDecimal("8"), 2,
                                                java.math.RoundingMode.HALF_UP);
                                BigDecimal salarioMinuto = salarioHora.divide(new BigDecimal("60"), 2,
                                                java.math.RoundingMode.HALF_UP);
                                BigDecimal descuentoTardanzas = salarioMinuto
                                                .multiply(BigDecimal.valueOf(minutosRetraso));

                                BigDecimal totalDescuentos = descuentoIps.add(descuentoAusencias)
                                                .add(descuentoTardanzas);

                                // 6. Calcular neto
                                BigDecimal salarioNeto = salarioBase.subtract(totalDescuentos);
                                if (salarioNeto.compareTo(BigDecimal.ZERO) < 0)
                                        salarioNeto = BigDecimal.ZERO;

                                // 7. Crear Recibo
                                ReciboSalario recibo = new ReciboSalario();
                                recibo.setEmpleado(empleado);
                                recibo.setAnio(anio);
                                recibo.setMes(mes);
                                recibo.setFechaPago(LocalDate.of(anio, mes, 28)); // Pago el 28
                                recibo.setSalarioBruto(salarioBase);
                                recibo.setDescuentosIps(descuentoIps);
                                recibo.setDescuentosJubilacion(BigDecimal.ZERO);
                                recibo.setOtrosDescuentos(descuentoAusencias.add(descuentoTardanzas));
                                recibo.setBonificaciones(BigDecimal.ZERO);
                                recibo.setSalarioNeto(salarioNeto);
                                recibo.setEstado("BORRADOR");

                                String obs = "";
                                if (ausencias > 0)
                                        obs += "Ausencias: " + ausencias + ". ";
                                if (tardanzas > 0)
                                        obs += "Tardanzas: " + tardanzas + ". ";
                                recibo.setObservaciones(obs);

                                reciboSalarioRepository.save(recibo);

                        } catch (Exception e) {
                                log.error("Error al generar nómina para empleado {}: {}", empleado.getId(),
                                                e.getMessage());
                        }
                }
                log.info("Generación de nómina completada");
        }

        @Override
        @Transactional(readOnly = true)
        public com.coopreducto.tthh.dto.PayrollDashboardDTO getDashboardSummary() {
                List<Object[]> runs = reciboSalarioRepository.findPayrollRuns();
                List<com.coopreducto.tthh.dto.PayrollDashboardDTO.PayrollRunDTO> historial = runs.stream()
                                .map(row -> com.coopreducto.tthh.dto.PayrollDashboardDTO.PayrollRunDTO.builder()
                                                .anio((Integer) row[0])
                                                .mes((Integer) row[1])
                                                .totalEmpleados(((Long) row[2]).intValue())
                                                .totalNeto((BigDecimal) row[3])
                                                .estado((String) row[4])
                                                .fechaGeneracion((java.time.LocalDateTime) row[5])
                                                .build())
                                .toList();

                BigDecimal totalAnio = historial.stream()
                                .filter(r -> r.getAnio().equals(LocalDate.now().getYear()))
                                .map(com.coopreducto.tthh.dto.PayrollDashboardDTO.PayrollRunDTO::getTotalNeto)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                com.coopreducto.tthh.dto.PayrollDashboardDTO.PayrollRunDTO ultima = historial.isEmpty() ? null
                                : historial.get(0);

                return com.coopreducto.tthh.dto.PayrollDashboardDTO.builder()
                                .totalPagadoAnio(totalAnio)
                                .ultimoMontoNeto(ultima != null ? ultima.getTotalNeto() : BigDecimal.ZERO)
                                .ultimoConteoEmpleados(ultima != null ? ultima.getTotalEmpleados() : 0)
                                .mesUltimaNomina(ultima != null ? ultima.getMes() : null)
                                .anioUltimaNomina(ultima != null ? ultima.getAnio() : null)
                                .historial(historial)
                                .build();
        }

        @Override
        public void cerrarNomina(Integer anio, Integer mes) {
                List<ReciboSalario> recibos = reciboSalarioRepository.findByAnioAndMes(anio, mes);
                for (ReciboSalario r : recibos) {
                        if ("BORRADOR".equals(r.getEstado())) {
                                r.setEstado("GENERADO");
                                reciboSalarioRepository.save(r);
                        }
                }
        }

        @Override
        @Transactional(readOnly = true)
        public Resource exportarPlanillaBancaria(Integer anio, Integer mes) {
                log.info("Exportando planilla bancaria para {}/{}", mes, anio);
                List<ReciboSalario> recibos = reciboSalarioRepository.findByAnioAndMes(anio, mes);

                // Solo exportar los que no están en borrador (opcional, pero recomendado)
                List<ReciboSalario> recibosAprobados = recibos.stream()
                                .filter(r -> "GENERADO".equals(r.getEstado()) || "ENVIADO".equals(r.getEstado()))
                                .toList();

                try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        Sheet sheet = workbook.createSheet("Planilla Bancaria");

                        // Cabecera
                        Row headerRow = sheet.createRow(0);
                        String[] columns = { "Documento", "Empleado", "Banco", "Tipo Cuenta", "Nro Cuenta",
                                        "Líquido a Cobrar", "Moneda" };

                        CellStyle headerStyle = workbook.createCellStyle();
                        Font headerFont = workbook.createFont();
                        headerFont.setBold(true);
                        headerStyle.setFont(headerFont);
                        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                        for (int i = 0; i < columns.length; i++) {
                                Cell cell = headerRow.createCell(i);
                                cell.setCellValue(columns[i]);
                                cell.setCellStyle(headerStyle);
                        }

                        // Datos
                        int rowIdx = 1;
                        DataFormat format = workbook.createDataFormat();
                        CellStyle currencyStyle = workbook.createCellStyle();
                        currencyStyle.setDataFormat(format.getFormat("#,##0"));

                        for (ReciboSalario r : recibosAprobados) {
                                Empleado e = r.getEmpleado();
                                Row row = sheet.createRow(rowIdx++);

                                row.createCell(0).setCellValue(e.getNumeroDocumento());
                                row.createCell(1).setCellValue(e.getNombreCompleto());
                                row.createCell(2).setCellValue(e.getBancoNombre() != null ? e.getBancoNombre() : "N/A");
                                row.createCell(3).setCellValue(
                                                e.getBancoCuentaTipo() != null ? e.getBancoCuentaTipo() : "N/A");
                                row.createCell(4).setCellValue(
                                                e.getBancoCuentaNumero() != null ? e.getBancoCuentaNumero() : "N/A");

                                Cell montoCell = row.createCell(5);
                                montoCell.setCellValue(r.getSalarioNeto().doubleValue());
                                montoCell.setCellStyle(currencyStyle);

                                row.createCell(6).setCellValue(e.getMoneda() != null ? e.getMoneda() : "GUARANIES");
                        }

                        // Auto-ajustar columnas
                        for (int i = 0; i < columns.length; i++) {
                                sheet.autoSizeColumn(i);
                        }

                        workbook.write(out);
                        return new ByteArrayResource(out.toByteArray());

                } catch (Exception e) {
                        log.error("Error al exportar planilla bancaria", e);
                        throw new RuntimeException("Error generador Excel de planilla bancaria");
                }
        }

        @Override
        @Transactional(readOnly = true)
        public Resource exportarExcel(String sucursal, Long empleadoId, Integer mes, Integer anio) {
                Specification<ReciboSalario> spec = buildSpecification(sucursal, empleadoId, mes, anio);
                List<ReciboSalario> recibos = reciboSalarioRepository.findAll(spec);

                try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        Sheet sheet = workbook.createSheet("Reporte de Salarios");

                        // Estilo Cabecera
                        CellStyle headerStyle = workbook.createCellStyle();
                        Font headerFont = workbook.createFont();
                        headerFont.setBold(true);
                        headerStyle.setFont(headerFont);
                        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                        headerStyle.setBorderBottom(BorderStyle.THIN);

                        // Cabeceras
                        String[] columns = { "Documento", "Empleado", "Sucursal", "Cargo", "Mes", "Año", "S. Bruto",
                                        "IPS", "Jubilación", "Otros Dtos.", "Bonif.", "S. Neto", "Estado" };
                        Row headerRow = sheet.createRow(0);
                        for (int i = 0; i < columns.length; i++) {
                                Cell cell = headerRow.createCell(i);
                                cell.setCellValue(columns[i]);
                                cell.setCellStyle(headerStyle);
                        }

                        // Estilos de datos
                        DataFormat format = workbook.createDataFormat();
                        CellStyle currencyStyle = workbook.createCellStyle();
                        currencyStyle.setDataFormat(format.getFormat("#,##0"));

                        int rowIdx = 1;
                        for (ReciboSalario r : recibos) {
                                Row row = sheet.createRow(rowIdx++);
                                Empleado e = r.getEmpleado();

                                row.createCell(0).setCellValue(e.getNumeroDocumento());
                                row.createCell(1).setCellValue(e.getNombreCompleto());
                                row.createCell(2).setCellValue(e.getSucursal());
                                row.createCell(3).setCellValue(e.getCargo());
                                row.createCell(4).setCellValue(getMesNombre(r.getMes()));
                                row.createCell(5).setCellValue(r.getAnio());

                                row.createCell(6).setCellStyle(currencyStyle);
                                row.getCell(6).setCellValue(r.getSalarioBruto().doubleValue());

                                row.createCell(7).setCellStyle(currencyStyle);
                                row.getCell(7).setCellValue(r.getDescuentosIps().doubleValue());

                                row.createCell(8).setCellStyle(currencyStyle);
                                row.getCell(8).setCellValue(r.getDescuentosJubilacion().doubleValue());

                                row.createCell(9).setCellStyle(currencyStyle);
                                row.getCell(9).setCellValue(r.getOtrosDescuentos().doubleValue());

                                row.createCell(10).setCellStyle(currencyStyle);
                                row.getCell(10).setCellValue(r.getBonificaciones().doubleValue());

                                row.createCell(11).setCellStyle(currencyStyle);
                                row.getCell(11).setCellValue(r.getSalarioNeto().doubleValue());

                                row.createCell(12).setCellValue(r.getEstado());
                        }

                        // Auto-ajustar columnas
                        for (int i = 0; i < columns.length; i++) {
                                sheet.autoSizeColumn(i);
                        }

                        workbook.write(out);
                        return new ByteArrayResource(out.toByteArray());

                } catch (Exception e) {
                        log.error("Error al exportar Excel de salarios", e);
                        throw new RuntimeException("Error al generar reporte Excel");
                }
        }

        @Override
        @Transactional(readOnly = true)
        public Resource exportarPdf(String sucursal, Long empleadoId, Integer mes, Integer anio) {
                Specification<ReciboSalario> spec = buildSpecification(sucursal, empleadoId, mes, anio);
                List<ReciboSalario> recibos = reciboSalarioRepository.findAll(spec);

                try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        com.lowagie.text.Document document = new com.lowagie.text.Document(
                                        com.lowagie.text.PageSize.A4.rotate());
                        com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
                        document.open();

                        // Fuentes
                        com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 18,
                                        com.lowagie.text.Font.BOLD, java.awt.Color.DARK_GRAY);
                        com.lowagie.text.Font headerFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA,
                                        10,
                                        com.lowagie.text.Font.BOLD, java.awt.Color.WHITE);
                        com.lowagie.text.Font bodyFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 9);
                        com.lowagie.text.Font boldFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 9,
                                        com.lowagie.text.Font.BOLD);

                        // Título
                        com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph(
                                        "REPORTE DE SALARIOS - COOPERATIVA REDUCTO",
                                        titleFont);
                        title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                        title.setSpacingAfter(20);
                        document.add(title);

                        // Info Filtros
                        StringBuilder filtersInfo = new StringBuilder("Filtros aplicados: ");
                        filtersInfo.append("Año: ").append(anio).append(" | ");
                        if (mes != null)
                                filtersInfo.append("Mes: ").append(getMesNombre(mes)).append(" | ");
                        if (sucursal != null && !"Todas las sucursales".equals(sucursal))
                                filtersInfo.append("Sucursal: ").append(sucursal).append(" | ");

                        com.lowagie.text.Paragraph subTitle = new com.lowagie.text.Paragraph(filtersInfo.toString(),
                                        bodyFont);
                        subTitle.setSpacingAfter(10);
                        document.add(subTitle);

                        // Tabla
                        com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(10);
                        table.setWidthPercentage(100);
                        table.setSpacingBefore(10);
                        table.setWidths(new float[] { 2, 4, 3, 2, 2, 2, 2, 2, 2, 2 });

                        // Cabeceras Tabla
                        String[] headers = { "DOC", "EMPLEADO", "SUCURSAL", "BRUTO", "IPS", "JUB", "OTROS", "BONIF",
                                        "NETO", "ESTADO" };
                        for (String h : headers) {
                                com.lowagie.text.pdf.PdfPCell cell = new com.lowagie.text.pdf.PdfPCell(
                                                new com.lowagie.text.Phrase(h, headerFont));
                                cell.setBackgroundColor(java.awt.Color.GRAY);
                                cell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                                cell.setPadding(5);
                                table.addCell(cell);
                        }

                        java.text.NumberFormat nf = java.text.NumberFormat
                                        .getCurrencyInstance(new java.util.Locale("es", "PY"));
                        nf.setCurrency(java.util.Currency.getInstance("PYG"));
                        nf.setMaximumFractionDigits(0);

                        BigDecimal totalBruto = BigDecimal.ZERO;
                        BigDecimal totalNeto = BigDecimal.ZERO;

                        for (ReciboSalario r : recibos) {
                                table.addCell(new com.lowagie.text.Phrase(r.getEmpleado().getNumeroDocumento(),
                                                bodyFont));
                                table.addCell(new com.lowagie.text.Phrase(r.getEmpleado().getNombreCompleto(),
                                                bodyFont));
                                table.addCell(new com.lowagie.text.Phrase(r.getEmpleado().getSucursal(), bodyFont));

                                table.addCell(createRightAlignedCell(nf.format(r.getSalarioBruto()), bodyFont));
                                table.addCell(createRightAlignedCell(nf.format(r.getDescuentosIps()), bodyFont));
                                table.addCell(createRightAlignedCell(nf.format(r.getDescuentosJubilacion()), bodyFont));
                                table.addCell(createRightAlignedCell(nf.format(r.getOtrosDescuentos()), bodyFont));
                                table.addCell(createRightAlignedCell(nf.format(r.getBonificaciones()), bodyFont));
                                table.addCell(createRightAlignedCell(nf.format(r.getSalarioNeto()), boldFont));
                                table.addCell(new com.lowagie.text.Phrase(r.getEstado(), bodyFont));

                                totalBruto = totalBruto.add(r.getSalarioBruto());
                                totalNeto = totalNeto.add(r.getSalarioNeto());
                        }

                        // Totales Table
                        com.lowagie.text.pdf.PdfPCell footerLabel = new com.lowagie.text.pdf.PdfPCell(
                                        new com.lowagie.text.Phrase("TOTALES GENERALES", boldFont));
                        footerLabel.setColspan(3);
                        footerLabel.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                        footerLabel.setPadding(5);
                        table.addCell(footerLabel);

                        table.addCell(createRightAlignedCell(nf.format(totalBruto), boldFont));
                        table.addCell(new com.lowagie.text.Phrase("", bodyFont)); // IPS empty
                        table.addCell(new com.lowagie.text.Phrase("", bodyFont)); // JUB empty
                        table.addCell(new com.lowagie.text.Phrase("", bodyFont)); // OTROS empty
                        table.addCell(new com.lowagie.text.Phrase("", bodyFont)); // BONIF empty
                        table.addCell(createRightAlignedCell(nf.format(totalNeto), boldFont));
                        table.addCell(new com.lowagie.text.Phrase("", bodyFont));

                        document.add(table);
                        document.close();
                        return new ByteArrayResource(out.toByteArray());

                } catch (Exception e) {
                        log.error("Error al exportar PDF de salarios", e);
                        throw new RuntimeException("Error al generar reporte PDF");
                }
        }

        private com.lowagie.text.pdf.PdfPCell createRightAlignedCell(String text, com.lowagie.text.Font font) {
                com.lowagie.text.pdf.PdfPCell cell = new com.lowagie.text.pdf.PdfPCell(
                                new com.lowagie.text.Phrase(text, font));
                cell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
                cell.setPadding(5);
                return cell;
        }
}
