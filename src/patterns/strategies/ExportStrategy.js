/**
 * Strategy Pattern para diferentes tipos de exportación de datos
 * Permite agregar nuevos formatos de exportación fácilmente
 */
import * as XLSX from "xlsx";

// Estrategia base
class ExportStrategy {
  export(data, fileName) {
    throw new Error("Método export debe ser implementado");
  }

  generateFileName(baseName, dateFrom, dateTo) {
    if (dateFrom && dateTo) {
      return `${baseName}-desde-${dateFrom}-hasta-${dateTo}`;
    } else if (dateFrom) {
      return `${baseName}-desde-${dateFrom}`;
    } else if (dateTo) {
      return `${baseName}-hasta-${dateTo}`;
    }
    return `${baseName}-sin-fecha-seleccionada`;
  }

  generateMessage(dateFrom, dateTo) {
    if (dateFrom && dateTo) {
      return `¿Quieres exportar los datos desde la fecha <b>${dateFrom}</b> hasta la fecha <b>${dateTo}</b> a un archivo Excel?`;
    } else if (dateFrom) {
      return `¿Quieres exportar los datos desde la fecha <b>${dateFrom}</b> a un archivo Excel?`;
    } else if (dateTo) {
      return `¿Quieres exportar los datos hasta la fecha <b>${dateTo}</b> a un archivo Excel?`;
    }
    return `¿Quieres exportar los datos a un archivo Excel?`;
  }
}

// Estrategia: Exportar a Excel
class ExcelExportStrategy extends ExportStrategy {
  export(data, fileName) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}

// Estrategia: Exportar a CSV (para futuro)
class CSVExportStrategy extends ExportStrategy {
  export(data, fileName) {
    // Convertir a CSV
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n");

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  generateMessage(dateFrom, dateTo) {
    return super.generateMessage(dateFrom, dateTo).replace("Excel", "CSV");
  }
}

export { ExcelExportStrategy, CSVExportStrategy, ExportStrategy };










