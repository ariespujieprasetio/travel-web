import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// ================== jsPDF + autoTable typing ==================
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: {
    head?: string[][];
    body?: string[][];
    startY?: number;
    theme?: string;
    styles?: {
      fontSize?: number;
      cellPadding?: number;
      [k: string]: any;
    };
    headStyles?: {
      fillColor?: number[] | number;
      textColor?: number;
      [k: string]: any;
    };
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    columnStyles?: Record<number, any>;
    didDrawPage?: (data: any) => void;
  }) => void;
  lastAutoTable?: {
    finalY: number;
  };
}

// ================== Table structures (existing) ==================
/** Represents a table data structure */
export interface TableData {
  headers: string[];
  rows: string[][];
}

// ================== Markdown table utils (existing) ==================
/** Parse markdown table into a structured format */
export function parseMarkdownTable(markdownTable: string): TableData {
  const lines = markdownTable.trim().split('\n');
  if (lines.length < 3) throw new Error('Invalid markdown table format');

  // headers
  const headerLine = lines[0].trim();
  const headerParts = headerLine.split('|');
  const headerCells = headerParts.slice(1, headerParts.length - 1);
  const headers = headerCells.map((header) => header.trim());

  // rows (skip separator at line 1)
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const rowLine = lines[i].trim();
    if (!rowLine) continue;
    const rowParts = rowLine.split('|');
    const rowCells = rowParts.slice(1, rowParts.length - 1);
    if (rowCells.length > 0) rows.push(rowCells.map((c) => c.trim()));
  }
  return { headers, rows };
}

/** Extract tables from markdown text */
export function extractTablesFromMarkdown(markdownText: string): TableData[] {
  const tableRegex = /\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n(?:\|[^\n]+\|\n)+/g;
  const tables: TableData[] = [];
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(markdownText)) !== null) {
    try {
      tables.push(parseMarkdownTable(match[0].trim()));
    } catch (err) {
      console.error('Error parsing markdown table:', err);
    }
  }
  return tables;
}

// ================== CSV/XLSX/PDF exports (existing) ==================
/** Export multiple tables to a single CSV file */
export function exportToCSV(tables: TableData[], filename: string = 'tables.csv'): void {
  const csvFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  const parts: string[] = [];

  tables.forEach((table, idx) => {
    if (idx > 0) {
      parts.push('\n\n');
      parts.push(`# Table ${idx + 1}\n`);
    }
    // headers
    const headerRow = table.headers
      .map((h) => (h.includes('"') || h.includes(',') ? `"${h.replace(/"/g, '""')}"` : h))
      .join(',');
    parts.push(headerRow);

    // rows
    table.rows.forEach((row) => {
      const padded = [...row];
      while (padded.length < table.headers.length) padded.push('');
      const csvRow = padded
        .map((cell) => (cell.includes('"') || cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell))
        .join(',');
      parts.push(csvRow);
    });
  });

  const blob = new Blob([parts.join('\n')], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, csvFilename);
}

/** Export multiple tables to a single XLSX file (each table = one sheet) */
export function exportToXLSX(tables: TableData[], filename: string = 'tables.xlsx', landscape: boolean = true): void {
  const xlsxFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  const wb = XLSX.utils.book_new();

  tables.forEach((table, index) => {
    const normalizedRows = table.rows.map((row) => {
      const padded = [...row];
      while (padded.length < table.headers.length) padded.push('');
      return padded;
    });

    const ws = XLSX.utils.aoa_to_sheet([table.headers, ...normalizedRows]);

    if (landscape) {
      // @ts-ignore
      ws['!printSetup'] = { orientation: 'landscape' };
      // @ts-ignore
      ws['!pageSetup'] = ws['!pageSetup'] || {};
      // @ts-ignore
      ws['!pageSetup'].orientation = 'landscape';
    }

    const sheetName = tables.length > 1 ? `Table ${index + 1}` : 'Sheet1';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, xlsxFilename);
}

/** Export multiple tables to a single PDF file */
export function exportToPDF(
  tables: TableData[],
  title: string = 'Exported Tables',
  filename: string = 'tables.pdf',
  landscape: boolean = true
): void {
  if (!tables.length) return;

  const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const doc = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait' }) as JsPDFWithAutoTable;

  // Title + timestamp
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  let y = 35;

  tables.forEach((table, idx) => {
    if (tables.length > 1) {
      y += 10;
      doc.setFontSize(12);
      doc.text(`Table ${idx + 1}`, 14, y);
      y += 5;
    }

    const normalizedRows = table.rows.map((row) => {
      const padded = [...row];
      while (padded.length < table.headers.length) padded.push('');
      return padded;
    });

    doc.autoTable({
      head: [table.headers],
      body: normalizedRows,
      startY: y,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [75, 58, 172], textColor: 255 }
    });

    y = (doc.lastAutoTable?.finalY || y) + 15;

    if (y > (landscape ? 190 : 260) && idx < tables.length - 1) {
      doc.addPage(landscape ? 'landscape' : 'portrait');
      y = 20;
    }
  });

  doc.save(pdfFilename);
}

/** Export all tables from markdown content to a single file */
export function exportTablesFromMarkdown(
  markdownText: string,
  format: 'csv' | 'xlsx' | 'pdf',
  baseFilename: string = 'tables'
): void {
  const tables = extractTablesFromMarkdown(markdownText);
  if (!tables.length) {
    console.warn('No tables found in the markdown text');
    return;
    }
  const filename = baseFilename.replace(/\.(csv|xlsx|pdf)$/, '');
  const full = `${filename}.${format}`;

  switch (format) {
    case 'csv':  exportToCSV(tables, full); break;
    case 'xlsx': exportToXLSX(tables, full); break;
    case 'pdf':  exportToPDF(tables, `${filename.charAt(0).toUpperCase() + filename.slice(1)} Tables`, full); break;
  }
}

/** Check if text contains a markdown table */
export function containsMarkdownTable(text: string): boolean {
  const tablePattern = /\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n(?:\|[^\n]+\|\n)+/;
  return tablePattern.test(text);
}

// ================== MODELED ITINERARY EXPORT (sys-new.txt) ==================

/**
 * Cari pesan bot terbaru yang:
 * - dari assistant/bot
 * - mengandung heading H1 (# Title)
 * - dan tabel itinerary dengan header "DAY | DESTINATION ..."
 */
function findLatestModeledMessage(
  messages: Array<{ sender?: string; role?: string; text?: string; content?: string }>
): string | null {
  const isAssistant = (m: any) => (m.role ? m.role === 'assistant' : m.sender === 'bot');
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (!isAssistant(msg)) continue;
    const body = (msg.content ?? msg.text ?? '').toString();
    if (!body) continue;
    if (/#\s.+/i.test(body) && /\|\s*DAY\s*\|\s*DESTINATION/i.test(body)) {
      return body;
    }
  }
  return null;
}

type ParsedItinerary = {
  title?: string;            // H1
  accommodation?: string;    // **ACCOMMODATION**: ...
  transportType?: string;    // **TYPE OF TRANSPORT**: ...
  dailyBudget?: string;      // **DAILY BUDGET**: ...
  itineraryTable?: TableData;
  transportDocTitle?: string; // "Transportation Logistics Documentation"
  transportTable?: TableData;
  budgetSummaryTitle?: string; // "BUDGET SUMMARY"
  budgetLines?: Array<{ label: string; value: string }>;
};

/** Parse itinerary modeled (markdown) ke struktur */
function parseModeledItinerary(md: string): ParsedItinerary {
  const out: ParsedItinerary = {};

  // Title H1
  const titleMatch = md.match(/^\s*#\s+(.+)\s*$/m);
  if (titleMatch) out.title = titleMatch[1].trim();

  // Key-Value Bold lines
  const kvRegex = /^\s*\*\*(.+?)\*\*\s*:\s*(.+)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = kvRegex.exec(md)) !== null) {
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (key.includes('accommodation')) out.accommodation = val;
    else if (key.includes('type of transport')) out.transportType = val;
    else if (key.includes('daily budget')) out.dailyBudget = val;
  }

  // Extract tables: [0] itinerary, [1] transport docs (jika ada)
  const tables = extractTablesFromMarkdown(md);
  if (tables.length > 0) out.itineraryTable = tables[0];
  if (tables.length > 1) out.transportTable = tables[1];

  // Transport docs heading
  const transTitle = md.match(/^\s*##\s+Transportation Logistics Documentation\s*$/mi);
  if (transTitle) out.transportDocTitle = 'Transportation Logistics Documentation';

  // Budget summary block
  const budgetBlock = md.match(/\*\*BUDGET SUMMARY\*\*([\s\S]*?)$/i);
  if (budgetBlock) {
    out.budgetSummaryTitle = 'BUDGET SUMMARY';
    const block = budgetBlock[1];
    const lineRegex = /^\s*\*\*(.+?)\*\*\s*:\s*(.+)\s*$/gm;
    const lines: Array<{ label: string; value: string }> = [];
    let lm: RegExpExecArray | null;
    while ((lm = lineRegex.exec(block)) !== null) {
      lines.push({ label: lm[1].trim(), value: lm[2].trim() });
    }
    out.budgetLines = lines;
  }
  return out;
}

/** Export itinerary modeled → PDF persis gaya sys-new.txt */
export function exportModeledItineraryToPDF(
  messages: Array<{ sender?: string; role?: string; text?: string; content?: string }>,
  filename: string = 'itinerary.pdf'
) {
  const md = findLatestModeledMessage(messages);
  if (!md) {
    console.warn('No modeled itinerary message found.');
    return;
  }
  const parsed = parseModeledItinerary(md);

  const doc = new jsPDF({ orientation: 'landscape' }) as JsPDFWithAutoTable;

  // Header
  let y = 18;
  doc.setFontSize(16);
  doc.text(parsed.title || 'Itinerary', 14, y);
  y += 8;

  // Subinfo (Accommodation/Transport/Budget)
  doc.setFontSize(10);
  const sub: string[] = [];
  if (parsed.accommodation) sub.push(`ACCOMMODATION: ${parsed.accommodation}`);
  if (parsed.transportType) sub.push(`TYPE OF TRANSPORT: ${parsed.transportType}`);
  if (parsed.dailyBudget) sub.push(`DAILY BUDGET: ${parsed.dailyBudget}`);
  sub.forEach((line) => { doc.text(line, 14, y); y += 6; });
  if (sub.length) y += 2;

  // Tabel Itinerary (wajib)
  if (parsed.itineraryTable) {
    const normalized = parsed.itineraryTable.rows.map((row) => {
      const padded = [...row];
      while (padded.length < parsed.itineraryTable!.headers.length) padded.push('');
      return padded;
    });

    doc.autoTable({
      head: [parsed.itineraryTable.headers],
      body: normalized,
      startY: y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, valign: 'top' },
      headStyles: { fillColor: [75, 58, 172], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 18 }, // DAY sempit
        // lainnya auto (akan wrap)
      },
      margin: { top: 14, left: 14, right: 14, bottom: 14 },
    });

    y = (doc.lastAutoTable?.finalY || y) + 10;
  }

  // Transportation Logistics Documentation (opsional)
  if (parsed.transportTable) {
    doc.setFontSize(12);
    doc.text(parsed.transportDocTitle || 'Transportation Logistics', 14, y);
    y += 6;

    const normalized = parsed.transportTable.rows.map((row) => {
      const padded = [...row];
      while (padded.length < parsed.transportTable!.headers.length) padded.push('');
      return padded;
    });

    doc.autoTable({
      head: [parsed.transportTable.headers],
      body: normalized,
      startY: y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, valign: 'top' },
      headStyles: { fillColor: [230, 230, 230], textColor: 20 },
      margin: { top: 14, left: 14, right: 14, bottom: 14 },
    });

    y = (doc.lastAutoTable?.finalY || y) + 10;
  }

  // Budget Summary (opsional)
  if (parsed.budgetLines && parsed.budgetLines.length) {
    doc.setFontSize(12);
    doc.text(parsed.budgetSummaryTitle || 'BUDGET SUMMARY', 14, y);
    y += 6;

    doc.setFontSize(10);
    parsed.budgetLines.forEach((ln) => {
      doc.text(`• ${ln.label}: ${ln.value}`, 16, y);
      y += 5;
    });
  }

  const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(pdfFilename);
}
