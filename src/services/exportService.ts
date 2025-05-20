import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add the missing type for jsPDF with autoTable
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: {
    head: string[][];
    body: string[][];
    startY: number;
    theme: string;
    styles: {
      fontSize: number;
      cellPadding: number;
    };
    headStyles: {
      fillColor: number[];
      textColor: number;
    };
  }) => void;
  lastAutoTable?: {
    finalY: number;
  };
}

/**
 * Represents a table data structure
 */
export interface TableData {
  headers: string[];
  rows: string[][];
}

/**
 * Parse markdown table into a structured format
 * Fixed to properly handle empty cells and rows
 */
export function parseMarkdownTable(markdownTable: string): TableData {
  const lines = markdownTable.trim().split('\n');
  
  if (lines.length < 3) {
    throw new Error('Invalid markdown table format');
  }
  
  // Extract headers (first row)
  const headerLine = lines[0].trim();
  // First, split by pipe character
  const headerParts = headerLine.split('|');
  // Remove first and last empty items (outside the table)
  const headerCells = headerParts.slice(1, headerParts.length - 1);
  // Trim each header cell
  const headers = headerCells.map(header => header.trim());
  
  // Skip separator row (line 1)
  
  // Process data rows (from line 2 onwards)
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const rowLine = lines[i].trim();
    if (rowLine) {
      // Split by pipe character
      const rowParts = rowLine.split('|');
      // Remove first and last empty items (outside the table)
      const rowCells = rowParts.slice(1, rowParts.length - 1);
      
      // If the row has content (even if some cells are empty)
      if (rowCells.length > 0) {
        // Preserve empty cells by just trimming each cell
        const rowData = rowCells.map(cell => cell.trim());
        rows.push(rowData);
      }
    }
  }
  
  return { headers, rows };
}

/**
 * Extract tables from markdown text
 * Improved to handle empty cells and preserve table structure
 */
export function extractTablesFromMarkdown(markdownText: string): TableData[] {
  // This regex matches Markdown tables with the following components:
  // 1. A header row that starts with | and contains text between pipes
  // 2. A separator row with | and ----- (possibly with : for alignment)
  // 3. One or more data rows that start with | and contain text between pipes
  const tableRegex = /\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n(?:\|[^\n]+\|\n)+/g;
  
  const tables: TableData[] = [];
  let match;
  
  while ((match = tableRegex.exec(markdownText)) !== null) {
    try {
      const tableMarkdown = match[0].trim();
      tables.push(parseMarkdownTable(tableMarkdown));
    } catch (error) {
      console.error('Error parsing markdown table:', error);
    }
  }
  
  return tables;
}

/**
 * Export multiple tables to a single CSV file
 */
export function exportToCSV(tables: TableData[], filename: string = 'tables.csv'): void {
  // Ensure proper extension
  const csvFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  
  // Create CSV content for all tables
  const csvParts: string[] = [];
  
  tables.forEach((tableData, index) => {
    // Add table header/separator if it's not the first table
    if (index > 0) {
      csvParts.push('\n\n'); // Add spacing between tables
      csvParts.push(`# Table ${index + 1}`); // Add table label as a comment
      csvParts.push('\n');
    }
    
    // Add table headers
    const headerRow = tableData.headers.map(header => {
      return header.includes('"') || header.includes(',') 
        ? `"${header.replace(/"/g, '""')}"`
        : header;
    }).join(',');
    csvParts.push(headerRow);
    
    // Add table rows
    tableData.rows.forEach(row => {
      // Ensure row length matches header length
      const paddedRow = [...row];
      while (paddedRow.length < tableData.headers.length) {
        paddedRow.push('');
      }
      
      const csvRow = paddedRow.map(cell => {
        return cell.includes('"') || cell.includes(',')
          ? `"${cell.replace(/"/g, '""')}"`
          : cell;
      }).join(',');
      
      csvParts.push(csvRow);
    });
  });
  
  const csvContent = csvParts.join('\n');
  
  // Create and download blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, csvFilename);
}

/**
 * Export multiple tables to a single XLSX file
 * Each table is placed in a separate worksheet
 */
export function exportToXLSX(tables: TableData[], filename: string = 'tables.xlsx', landscape: boolean = true): void {
  // Ensure proper extension
  const xlsxFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add each table as a separate worksheet
  tables.forEach((tableData, index) => {
    // Prepare data with consistent column count
    const normalizedRows = tableData.rows.map(row => {
      // Ensure each row has the same number of columns as headers
      const paddedRow = [...row];
      while (paddedRow.length < tableData.headers.length) {
        paddedRow.push('');
      }
      return paddedRow;
    });
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      tableData.headers,
      ...normalizedRows
    ]);
    
    // Set landscape orientation using worksheet properties
    if (landscape) {
      // Add worksheet print setup properties
      ws['!printSetup'] = { orientation: 'landscape' };
      
      // Add page properties that control orientation
      if (!ws['!pageSetup']) ws['!pageSetup'] = {};
      ws['!pageSetup'].orientation = 'landscape';
    }
    
    // Add worksheet to workbook with appropriate name
    const sheetName = tables.length > 1 ? `Table ${index + 1}` : 'Sheet1';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });
  
  // Generate and download file
  XLSX.writeFile(wb, xlsxFilename);
}

/**
 * Export multiple tables to a single PDF file
 */
export function exportToPDF(
  tables: TableData[], 
  title: string = 'Exported Tables',
  filename: string = 'tables.pdf',
  landscape: boolean = true
): void {
  if (tables.length === 0) return;
  
  // Ensure proper extension
  const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  
  // Create PDF document
  const doc = new jsPDF({
    orientation: landscape ? 'landscape' : 'portrait'
  }) as JsPDFWithAutoTable;
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  // Add creation info
  doc.setFontSize(10);
  const dateString = new Date().toLocaleString();
  doc.text(`Generated on: ${dateString}`, 14, 30);
  
  let yPosition = 35; // Starting Y position for the first table
  
  // Add each table to the PDF
  tables.forEach((tableData, index) => {
    // Add table title if there are multiple tables
    if (tables.length > 1) {
      yPosition += 10;
      doc.setFontSize(12);
      doc.text(`Table ${index + 1}`, 14, yPosition);
      yPosition += 5;
    }
    
    // Normalize rows to have consistent column count
    const normalizedRows = tableData.rows.map(row => {
      const paddedRow = [...row];
      while (paddedRow.length < tableData.headers.length) {
        paddedRow.push('');
      }
      return paddedRow;
    });
    
    // Add table
    doc.autoTable({
      head: [tableData.headers],
      body: normalizedRows,
      startY: yPosition,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [75, 58, 172],
        textColor: 255
      }
    });
    
    // Update position for the next table (get the final y position after the table is drawn)
    if (doc.lastAutoTable) {
      yPosition = doc.lastAutoTable.finalY + 15;
    } else {
      // Fallback if lastAutoTable is not available
      yPosition += 10 + (normalizedRows.length * 8);
    }
    
    // Add a new page if we're near the end of the page and there are more tables to come
    if (yPosition > (landscape ? 190 : 260) && index < tables.length - 1) {
      doc.addPage(landscape ? 'landscape' : 'portrait');
      yPosition = 20;
    }
  });
  
  // Save PDF
  doc.save(pdfFilename);
}

/**
 * Export all tables from markdown content to a single file
 */
export function exportTablesFromMarkdown(
  markdownText: string,
  format: 'csv' | 'xlsx' | 'pdf',
  baseFilename: string = 'tables'
): void {
  const tables = extractTablesFromMarkdown(markdownText);
  console.log(tables);
  
  if (tables.length === 0) {
    console.warn('No tables found in the markdown text');
    return;
  }
  
  // Ensure the filename has no extension initially
  const filename = baseFilename.replace(/\.(csv|xlsx|pdf)$/, '');
  
  // Add appropriate extension
  const fullFilename = `${filename}.${format}`;
  
  // Export all tables to a single file based on format
  switch (format) {
    case 'csv':
      exportToCSV(tables, fullFilename);
      break;
    case 'xlsx':
      exportToXLSX(tables, fullFilename);
      break;
    case 'pdf':
      exportToPDF(tables, `${filename.charAt(0).toUpperCase() + filename.slice(1)} Tables`, fullFilename);
      break;
  }
}

/**
 * Check if text contains a markdown table
 */
export function containsMarkdownTable(text: string): boolean {
  // This pattern checks for the basic structure of a markdown table
  const tablePattern = /\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n(?:\|[^\n]+\|\n)+/;
  return tablePattern.test(text);
}