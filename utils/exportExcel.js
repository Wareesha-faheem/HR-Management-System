// Multi-sheet Excel export via SheetJS. Only imported where actually used
// (Reports page) so the rest of the app's bundle stays untouched.
export async function exportToExcel(filename, sheets) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ name, headers, rows }) => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(workbook, worksheet, name.slice(0, 31)); // Excel sheet name limit
  });

  XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}
