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
      textColor?: number[] | number;
      [k: string]: any;
    };
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    columnStyles?: Record<number, any>;
    didDrawPage?: (data: any) => void;
    tableWidth?: 'auto' | 'wrap' | number;
    alternateRowStyles?:  {
      fillColor?: number[] | number;
      textColor?: number[] | number;
      [k: string]: any;
    };
  }) => void;
  lastAutoTable?: {
    finalY: number;
  };
}

// ================== Table structures ==================
/** Represents a table data structure */
export interface TableData {
  headers: string[];
  rows: string[][];
}

// ================== Markdown table utils ==================
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

// ================== CSV/XLSX/PDF exports ==================
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

// ================== MODELED ITINERARY EXPORT ==================

/**
 * Cari pesan bot terbaru yang mengandung itinerary modeled
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
    // Check for itinerary indicators
    if (body.includes('|') && (/#\s.+/i.test(body) || /day\s*\d+/i.test(body) || /itinerary/i.test(body))) {
      return body;
    }
  }
  return null;
}

type ParsedItinerary = {
  title?: string;
  accommodation?: string;
  transportType?: string;
  dailyBudget?: string;
  itineraryTable?: TableData;
  transportDocTitle?: string;
  transportTable?: TableData;
  budgetSummaryTitle?: string;
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
    else if (key.includes('daily budget') || key.includes('budget per day')) out.dailyBudget = val;
  }

  // Extract tables
  const tables = extractTablesFromMarkdown(md);
  if (tables.length > 0) out.itineraryTable = tables[0];
  if (tables.length > 1) out.transportTable = tables[1];

  // Transport docs heading
  const transTitle = md.match(/^\s*##\s+Transportation Logistics Documentation\s*$/mi);
  if (transTitle) out.transportDocTitle = 'Transportation Logistics Documentation';

  // Budget summary block - lebih fleksibel
  const budgetBlock = md.match(/(?:\*\*)?(?:BUDGET\s*SUMMARY|Budget\s*Summary|TOTAL\s*COST|Total\s*Cost)(?:\*\*)?[\s\S]*?(?=\n\n|\n#|$)/i);
  if (budgetBlock) {
    out.budgetSummaryTitle = 'BUDGET SUMMARY';
    const block = budgetBlock[0];
    const lineRegex = /(?:\*\*(.+?)\*\*\s*:|\*\*?(.+?)\*\*?\s*:|\-\s*(.+?):)\s*(.+)$/gm;
    const lines: Array<{ label: string; value: string }> = [];
    let lm: RegExpExecArray | null;
    while ((lm = lineRegex.exec(block)) !== null) {
      const label = (lm[1] || lm[2] || lm[3] || '').trim();
      const value = (lm[4] || '').trim();
      if (label && value) {
        lines.push({ label, value });
      }
    }
    out.budgetLines = lines;
  }
  return out;
}

/** Export itinerary modeled → PDF dengan format Travel Planner */
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
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = 15;
  const leftMargin = 15;
  const rightMargin = 15;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // Extract dynamic info dari parsed data dan original message
  const titleText = parsed.title || 'Travel Itinerary';
  
  // Extract tanggal dari title atau content
  const dateMatches = md.match(/(\d{1,2}[-\s](?:January|February|March|April|May|June|July|August|September|October|November|December)[-\s]\d{4})|(\d{1,2}\/\d{1,2}\/\d{4})|(\d{4}-\d{2}-\d{2})/gi);
  const locationMatches = md.match(/(Tokyo|Japan|Yogyakarta|Indonesia|Singapore|Bangkok|Seoul|Korea|Thailand|Malaysia|Kuala Lumpur|Philippines|Manila|Vietnam|Ho Chi Minh|Hanoi|Myanmar|Yangon|Cambodia|Phnom Penh|Laos|Vientiane|Brunei|Bandar Seri Begawan|Paris|France|London|England|UK|Rome|Italy|Berlin|Germany|Madrid|Spain|Amsterdam|Netherlands|New York|USA|America|Sydney|Australia|Cairo|Egypt|Barcelona|[A-Z][a-z]+ [A-Z][a-z]+)/gi);
  
  // Extract duration dari content
  const durationMatch = md.match(/(\d+)[\s-]*(day|days)/i);
  const duration = durationMatch ? durationMatch[1] : '3';
  
  // Extract person count dari content
  const personMatch = md.match(/(\d+)\s*(?:person|people|traveler|travelers|pax)/i);
  const personCount = personMatch ? `${personMatch[1]} person${parseInt(personMatch[1]) > 1 ? 's' : ''}` : '1 person';
  
  const dateInfo = dateMatches ? dateMatches.slice(0, 2).join(' - ') : 'Date not specified';
  const locationInfo = locationMatches ? locationMatches[0] : 'Destination';

  // Extract major events dari content
  let majorEventText = '';
  const eventMatches = md.match(/(?:festival|event|celebration|matsuri|holiday|concert|exhibition)[\s\S]*?(?=\n\n|\.|Day|##)/gi);
  if (eventMatches) {
    majorEventText = eventMatches[0].substring(0, 50) + '...';
  }

  // Extract weather info dari content
  let weatherInfo = 'Please check local weather forecast';
  const weatherMatch = md.match(/(?:temperature|weather|climate)[\s\S]*?(\d+°?[CF]?)/i);
  if (weatherMatch) {
    weatherInfo = `Temperature around ${weatherMatch[1]}`;
  }

  // Extract news/updates dari content
  let newsInfo = '';
  const newsMatch = md.match(/(?:news|update|alert|warning|notice)[\s\S]*?(?=\n\n|\.|Day)/i);
  if (newsMatch) {
    newsInfo = newsMatch[0].substring(0, 100) + '...';
  }

  // Tentukan nationalDayText
  let nationalDayText = `No major national holidays during ${dateInfo}`;
  const holidayMatch = md.match(/(?:holiday|national day|public holiday)[\s\S]*?(?=\n\n|\.|Day)/i);
  if (holidayMatch) {
    nationalDayText = holidayMatch[0].substring(0, 80) + '...';
  }

  // ======= HEADER TRAVEL PLANNER PALING ATAS =======
  y = 20;
  const headerHeight = 23; // lebih tinggi agar jarak atas-bawah seimbang
  doc.setFillColor(153, 51, 255); // ungu
  doc.rect(leftMargin, y, contentWidth, headerHeight, 'F');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('TRAVEL PLANNER', pageWidth / 2, y + headerHeight / 2, { align: 'center', baseline: 'middle' });
  y += headerHeight + 10;

  // ======= TABEL INFO UTAMA (Date, Country, Person) =======
  const infoMainTableBody: string[][] = [
    ['Date', ':', dateInfo],
    ['Country', ':', locationInfo],
    ['Person', ':', personCount]
  ];
  doc.autoTable({
    body: infoMainTableBody,
    startY: y,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.2, // garis lebih tipis
      valign: 'top',
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: contentWidth - 70 }
    },
    margin: { left: leftMargin, right: rightMargin },
    tableWidth: contentWidth
  });
  y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY : y + 30;

  // ======= TABEL DETAIL (Major Event, National Day, Weather, News) =======
  doc.autoTable({
    head: [['Information Detail']],
    body: [],
    startY: y,
    theme: 'plain', // tanpa grid
    headStyles: {
      fillColor: [153, 51, 255],
      textColor: [255, 255, 255],
      fontSize: 13,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0,
      lineColor: [0, 0, 0]
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0,
      halign: 'center',
      valign: 'middle',
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: contentWidth, halign: 'center' }
    },
    margin: { left: leftMargin, right: rightMargin },
    tableWidth: contentWidth
  });
  y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY : y + 15;
  doc.autoTable({
    body: [
      ['Major Event', ':', majorEventText || '-'],
      ['National Day', ':', nationalDayText],
      ['Weather', ':', weatherInfo],
      ['News', ':', newsInfo || '-']
    ],
    startY: y,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      valign: 'top',
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: contentWidth - 70, halign: 'left' }
    },
    margin: { left: leftMargin, right: rightMargin },
    tableWidth: contentWidth
  });
  y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : y + 40;

  // Itinerary Tables berdasarkan data aktual
  if (parsed.itineraryTable) {
    // Group rows by day
    const dayGroups: { [key: string]: string[][] } = {};
    parsed.itineraryTable.rows.forEach(row => {
      let dayValue = 'DAY 1';
      
      const dayColIndex = parsed.itineraryTable!.headers.findIndex(h => 
        h.toLowerCase().includes('day')
      );
      
      if (dayColIndex >= 0 && row[dayColIndex]) {
        dayValue = row[dayColIndex].toUpperCase().includes('DAY') ? row[dayColIndex] : `DAY ${row[dayColIndex]}`;
      } else if (row[0] && /day\s*\d+/i.test(row[0])) {
        dayValue = row[0];
      }
      
      if (!dayGroups[dayValue]) dayGroups[dayValue] = [];
      dayGroups[dayValue].push(row);
    });

    const dayKeys = Object.keys(dayGroups).sort();
    
    dayKeys.forEach((dayKey, dayIndex) => {
      if (dayIndex > 0 || y > pageHeight - 100) {
        doc.addPage();
        y = 25;
      }
      doc.autoTable({
        head: [[dayKey.toUpperCase()]],
        body: [],
        startY: y,
        theme: 'plain',
        headStyles: {
          fillColor: [153, 51, 255],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.2,
          lineColor: [0, 0, 0]
        },
        margin: { left: leftMargin, right: rightMargin },
        tableWidth: contentWidth,
        columnStyles: {
          0: { cellWidth: contentWidth }
        }
      });
      y = doc.lastAutoTable?.finalY ?? y;
      const dayRows = dayGroups[dayKey];
      const headers = parsed.itineraryTable!.headers.map(h => h.toLowerCase());
      const mappedRows: string[][] = dayRows.map(row => {
        const timeIdx = headers.findIndex(h => h.includes('time') && !h.includes('travel'));
        const activityIdx = headers.findIndex(h => h.includes('activity') || h.includes('event') || h.includes('place'));
        const locationIdx = headers.findIndex(h => h.includes('location') || h.includes('venue') || h.includes('destination'));
        const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('cost') || h.includes('budget'));
        const addressIdx = headers.findIndex(h => h.includes('address') || h.includes('addr'));
        const travelTimeIdx = headers.findIndex(h => (h.includes('travel') && h.includes('time')) || h.includes('duration') || h.includes('transport time'));
        const noteIdx = headers.findIndex(h => h.includes('note') || h.includes('description') || h.includes('detail') || h.includes('remark'));
        return [
          timeIdx >= 0 ? row[timeIdx] || '' : (row[0] || ''),
          activityIdx >= 0 ? row[activityIdx] || '' : (row[1] || ''),
          locationIdx >= 0 ? row[locationIdx] || '' : (row[2] || ''),
          priceIdx >= 0 ? row[priceIdx] || '' : (row[3] || ''),
          addressIdx >= 0 ? row[addressIdx] || '' : (row[4] || ''),
          travelTimeIdx >= 0 ? row[travelTimeIdx] || '' : (row[5] || ''),
          noteIdx >= 0 ? row[noteIdx] || '' : (row[6] || '')
        ];
      });
      doc.autoTable({
        head: [['Time', 'Activity', 'Location', 'Price', 'Address', 'Time Travel', 'Note']],
        body: mappedRows,
        startY: y,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [153, 51, 255],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center',
          lineWidth: 0.2
        },
        columnStyles: {
          0: { cellWidth: contentWidth / 7, halign: 'center' },
          1: { cellWidth: contentWidth / 7 },
          2: { cellWidth: contentWidth / 7 },
          3: { cellWidth: contentWidth / 7, halign: 'center' },
          4: { cellWidth: contentWidth / 7 },
          5: { cellWidth: contentWidth / 7, halign: 'center' },
          6: { cellWidth: contentWidth / 7 }
        },
        margin: { left: leftMargin, right: rightMargin },
        tableWidth: contentWidth
      });
      y = (doc.lastAutoTable?.finalY ?? y + 15) + 8;
    });
  }

  // --- Pisahkan ke halaman baru ---
  doc.addPage();
  y = 30;
  doc.autoTable({
    head: [['BUDGET SUMMARY']],
    body: [],
    startY: y,
    theme: 'plain',
    headStyles: {
      fillColor: [153, 51, 255],
      textColor: [255, 255, 255],
      fontSize: 12,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.2,
      lineColor: [0, 0, 0]
    },
    margin: { left: leftMargin, right: rightMargin },
    tableWidth: contentWidth,
    columnStyles: {
      0: { cellWidth: contentWidth }
    }
  });
  y = doc.lastAutoTable?.finalY ?? y;
  const budgetTableBody: string[][] = [];
  if (parsed.budgetLines && parsed.budgetLines.length > 0) {
    parsed.budgetLines.forEach(line => {
      budgetTableBody.push([line.label, ':', line.value]);
    });
  } else {
    budgetTableBody.push(['Total Estimated Cost', ':', 'Not specified']);
    budgetTableBody.push(['Daily Average Per Person', ':', parsed.dailyBudget || 'Not specified']);
    budgetTableBody.push(['Accommodation', ':', parsed.accommodation || 'Not specified']);
    budgetTableBody.push(['Transportation', ':', parsed.transportType || 'Not specified']);
  }
  doc.autoTable({
    body: budgetTableBody,
    startY: y,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: contentWidth - 70, halign: 'left' }
    },
    margin: { left: leftMargin, right: rightMargin },
    tableWidth: contentWidth
  });

  const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(pdfFilename);
}