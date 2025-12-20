package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.ReciboComisionDTO;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.ReciboComision;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.repository.ReciboComisionRepository;
import com.coopreducto.tthh.service.ReciboComisionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import java.io.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class ReciboComisionServiceImpl implements ReciboComisionService {

    private final ReciboComisionRepository reciboComisionRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ReciboComisionDTO> findByEmpleadoAndAnio(Long empleadoId, Integer anio, Pageable pageable) {
        if (empleadoId != null) {
            return reciboComisionRepository.findByEmpleadoIdAndAnio(empleadoId, anio, pageable)
                    .map(this::convertToDTO);
        } else {
            return reciboComisionRepository.findAll(pageable)
                    .map(this::convertToDTO);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReciboComisionDTO> findByFilters(String sucursal, Long empleadoId, Integer mes, Integer anio,
            Pageable pageable) {
        Specification<ReciboComision> spec = buildSpecification(sucursal, empleadoId, mes, anio);
        return reciboComisionRepository.findAll(spec, pageable).map(this::convertToDTO);
    }

    private Specification<ReciboComision> buildSpecification(String sucursal, Long empleadoId, Integer mes,
            Integer anio) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            log.info("Building commission spec with: sucursal={}, empleadoId={}, mes={}, anio={}", sucursal, empleadoId,
                    mes, anio);

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
    public Resource exportarExcel(String sucursal, Long empleadoId, Integer mes, Integer anio) {
        Specification<ReciboComision> spec = buildSpecification(sucursal, empleadoId, mes, anio);
        List<ReciboComision> comisiones = reciboComisionRepository.findAll(spec);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte de Comisiones");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);

            String[] columns = { "Documento", "Empleado", "Sucursal", "Mes", "Año", "Producción", "% Meta", "Comisión",
                    "Estado" };
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            DataFormat format = workbook.createDataFormat();
            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(format.getFormat("#,##0"));

            CellStyle percentStyle = workbook.createCellStyle();
            percentStyle.setDataFormat(format.getFormat("0.00%"));

            int rowIdx = 1;
            for (ReciboComision c : comisiones) {
                Row row = sheet.createRow(rowIdx++);
                Empleado e = c.getEmpleado();

                row.createCell(0).setCellValue(e.getNumeroDocumento());
                row.createCell(1).setCellValue(e.getNombreCompleto());
                row.createCell(2).setCellValue(e.getSucursal());
                row.createCell(3).setCellValue(getMesNombre(c.getMes()));
                row.createCell(4).setCellValue(c.getAnio());

                Cell prodCell = row.createCell(5);
                prodCell.setCellValue(c.getProduccionMensual().doubleValue());
                prodCell.setCellStyle(currencyStyle);

                Cell metaCell = row.createCell(6);
                metaCell.setCellValue(c.getMetaAlcanzadaPorcentaje().doubleValue() / 100.0);
                metaCell.setCellStyle(percentStyle);

                Cell comCell = row.createCell(7);
                comCell.setCellValue(c.getMontoComision().doubleValue());
                comCell.setCellStyle(currencyStyle);

                row.createCell(8).setCellValue(c.getEstado());
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
        } catch (Exception e) {
            log.error("Error exporting commissions Excel", e);
            throw new RuntimeException("Error al generar reporte Excel");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource exportarPdf(String sucursal, Long empleadoId, Integer mes, Integer anio) {
        Specification<ReciboComision> spec = buildSpecification(sucursal, empleadoId, mes, anio);
        List<ReciboComision> comisiones = reciboComisionRepository.findAll(spec);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document(com.lowagie.text.PageSize.A4.rotate());
            com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 18,
                    com.lowagie.text.Font.BOLD, java.awt.Color.DARK_GRAY);
            com.lowagie.text.Font headerFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 10,
                    com.lowagie.text.Font.BOLD, java.awt.Color.WHITE);
            com.lowagie.text.Font bodyFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 9);
            com.lowagie.text.Font boldFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 9,
                    com.lowagie.text.Font.BOLD);

            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph(
                    "REPORTE DE COMISIONES - COOPERATIVA REDUCTO", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 2, 4, 3, 2, 2, 2, 2, 2 });

            String[] headers = { "DOC", "EMPLEADO", "SUCURSAL", "MES", "PRODUCCIÓN", "% META", "COMISIÓN", "ESTADO" };
            for (String h : headers) {
                com.lowagie.text.pdf.PdfPCell cell = new com.lowagie.text.pdf.PdfPCell(
                        new com.lowagie.text.Phrase(h, headerFont));
                cell.setBackgroundColor(java.awt.Color.GRAY);
                cell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }

            java.text.NumberFormat nf = java.text.NumberFormat.getCurrencyInstance(new java.util.Locale("es", "PY"));
            nf.setCurrency(java.util.Currency.getInstance("PYG"));
            nf.setMaximumFractionDigits(0);

            BigDecimal totalProduccion = BigDecimal.ZERO;
            BigDecimal totalComisiones = BigDecimal.ZERO;

            for (ReciboComision c : comisiones) {
                table.addCell(new com.lowagie.text.Phrase(c.getEmpleado().getNumeroDocumento(), bodyFont));
                table.addCell(new com.lowagie.text.Phrase(c.getEmpleado().getNombreCompleto(), bodyFont));
                table.addCell(new com.lowagie.text.Phrase(c.getEmpleado().getSucursal(), bodyFont));
                table.addCell(new com.lowagie.text.Phrase(getMesNombre(c.getMes()), bodyFont));

                table.addCell(createRightAlignedCell(nf.format(c.getProduccionMensual()), bodyFont));
                table.addCell(createRightAlignedCell(c.getMetaAlcanzadaPorcentaje().toString() + "%", bodyFont));
                table.addCell(createRightAlignedCell(nf.format(c.getMontoComision()), boldFont));
                table.addCell(new com.lowagie.text.Phrase(c.getEstado(), bodyFont));

                totalProduccion = totalProduccion.add(c.getProduccionMensual());
                totalComisiones = totalComisiones.add(c.getMontoComision());
            }

            com.lowagie.text.pdf.PdfPCell footerLabel = new com.lowagie.text.pdf.PdfPCell(
                    new com.lowagie.text.Phrase("TOTALES GENERALES", boldFont));
            footerLabel.setColspan(4);
            footerLabel.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
            footerLabel.setPadding(5);
            table.addCell(footerLabel);

            table.addCell(createRightAlignedCell(nf.format(totalProduccion), boldFont));
            table.addCell(new com.lowagie.text.Phrase("", bodyFont));
            table.addCell(createRightAlignedCell(nf.format(totalComisiones), boldFont));
            table.addCell(new com.lowagie.text.Phrase("", bodyFont));

            document.add(table);
            document.close();
            return new ByteArrayResource(out.toByteArray());
        } catch (Exception e) {
            log.error("Error exporting commissions PDF", e);
            throw new RuntimeException("Error al generar reporte PDF");
        }
    }

    private com.lowagie.text.pdf.PdfPCell createRightAlignedCell(String text, com.lowagie.text.Font font) {
        com.lowagie.text.pdf.PdfPCell cell = new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Phrase(text, font));
        cell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
        cell.setPadding(5);
        return cell;
    }

    private String getMesNombre(int mes) {
        String[] meses = { "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
                "Octubre", "Noviembre", "Diciembre" };
        return meses[mes - 1];
    }

    @Override
    @Transactional(readOnly = true)
    public ReciboComisionDTO findById(Long id) {
        ReciboComision comision = reciboComisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recibo de comisión no encontrado"));
        return convertToDTO(comision);
    }

    @Override
    public ReciboComisionDTO create(ReciboComisionDTO dto) {
        Empleado empleado = empleadoRepository.findById(dto.getEmpleadoId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        ReciboComision entity = convertToEntity(dto);
        entity.setEmpleado(empleado);
        entity.setEstado("GENERADO");

        return convertToDTO(reciboComisionRepository.save(entity));
    }

    @Override
    public Resource getPdfResource(Long id) {
        ReciboComision comision = reciboComisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recibo de comisión no encontrado"));
        Empleado empleado = comision.getEmpleado();

        try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document(com.lowagie.text.PageSize.A4);
            com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            com.lowagie.text.Font companyFont = com.lowagie.text.FontFactory
                    .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 16, java.awt.Color.decode("#006400"));
            com.lowagie.text.Font titleFont = com.lowagie.text.FontFactory
                    .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 14);
            com.lowagie.text.Font headerLabelFont = com.lowagie.text.FontFactory
                    .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 9);
            com.lowagie.text.Font normalFont = com.lowagie.text.FontFactory
                    .getFont(com.lowagie.text.FontFactory.HELVETICA, 9);
            com.lowagie.text.Font smallFont = com.lowagie.text.FontFactory
                    .getFont(com.lowagie.text.FontFactory.HELVETICA, 8);

            java.text.NumberFormat nf = java.text.NumberFormat
                    .getCurrencyInstance(java.util.Locale.forLanguageTag("es-PY"));
            java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yy");

            // Header (Simple Version)
            document.add(new com.lowagie.text.Paragraph("Cooperativa Reducto Ltda", companyFont));
            document.add(new com.lowagie.text.Paragraph("LIQUIDACIÓN DE COMISIONES", titleFont));
            document.add(new com.lowagie.text.Paragraph("\n"));

            // Empleado Info
            document.add(new com.lowagie.text.Paragraph("Empleado: " + empleado.getNombreCompleto(), normalFont));
            document.add(new com.lowagie.text.Paragraph("Documento: " + empleado.getNumeroDocumento(), normalFont));
            document.add(new com.lowagie.text.Paragraph("Cargo: " + empleado.getCargo(), normalFont));
            document.add(new com.lowagie.text.Paragraph("Periodo: " + comision.getMes() + "/" + comision.getAnio(),
                    normalFont));
            document.add(new com.lowagie.text.Paragraph("\n"));

            // Table of concepts
            com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(2);
            table.setWidthPercentage(100);

            table.addCell(new com.lowagie.text.Phrase("Concepto", headerLabelFont));
            table.addCell(new com.lowagie.text.Phrase("Monto", headerLabelFont));

            table.addCell(new com.lowagie.text.Phrase("Producción Mensual Alcanzada", normalFont));
            table.addCell(new com.lowagie.text.Phrase(nf.format(comision.getProduccionMensual()), normalFont));

            table.addCell(new com.lowagie.text.Phrase("Comisión Liquidada", normalFont));
            table.addCell(new com.lowagie.text.Phrase(nf.format(comision.getMontoComision()), normalFont));

            document.add(table);

            document.add(new com.lowagie.text.Paragraph("\n\n"));
            document.add(new com.lowagie.text.Paragraph("________________________", normalFont));
            document.add(new com.lowagie.text.Paragraph("Firma Recibí Conforme", smallFont));

            document.close();
            return new ByteArrayResource(out.toByteArray());

        } catch (Exception e) {
            log.error("Error generating Commission PDF", e);
            throw new RuntimeException("Error al generar el PDF de la comisión");
        }
    }

    @Override
    public void generarComisionesMensuales(Integer anio, Integer mes) {
        // Logic to generate bulk commissions if needed (e.g. from an import)
    }

    @Override
    public void cerrarComisiones(Integer anio, Integer mes) {
        List<ReciboComision> comisiones = reciboComisionRepository.findByAnioAndMes(anio, mes);
        for (ReciboComision c : comisiones) {
            if ("BORRADOR".equals(c.getEstado())) {
                c.setEstado("GENERADO");
                reciboComisionRepository.save(c);
            }
        }
    }

    private ReciboComisionDTO convertToDTO(ReciboComision entity) {
        return ReciboComisionDTO.builder()
                .id(entity.getId())
                .empleadoId(entity.getEmpleado().getId())
                .empleadoNombre(entity.getEmpleado().getNombreCompleto())
                .anio(entity.getAnio())
                .mes(entity.getMes())
                .fechaPago(entity.getFechaPago())
                .montoComision(entity.getMontoComision())
                .produccionMensual(entity.getProduccionMensual())
                .metaAlcanzadaPorcentaje(entity.getMetaAlcanzadaPorcentaje())
                .pdfUrl(entity.getPdfUrl())
                .estado(entity.getEstado())
                .observaciones(entity.getObservaciones())
                .build();
    }

    private ReciboComision convertToEntity(ReciboComisionDTO dto) {
        ReciboComision entity = new ReciboComision();
        entity.setAnio(dto.getAnio());
        entity.setMes(dto.getMes());
        entity.setFechaPago(dto.getFechaPago() != null ? dto.getFechaPago() : LocalDate.now());
        entity.setMontoComision(dto.getMontoComision());
        entity.setProduccionMensual(dto.getProduccionMensual());
        entity.setMetaAlcanzadaPorcentaje(dto.getMetaAlcanzadaPorcentaje());
        entity.setPdfUrl(dto.getPdfUrl());
        entity.setEstado(dto.getEstado());
        entity.setObservaciones(dto.getObservaciones());
        return entity;
    }
}
