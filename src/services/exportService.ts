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
      headStyles: { fillColor: [153, 51, 255], textColor: 255 }
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
  const isAssistant = (m: any) => (m.role ? m.role === "assistant" : m.sender === "bot");
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (!isAssistant(msg)) continue;
    const body = (msg.content ?? msg.text ?? "").toString();
    if (!body) continue;

    // Itinerary style
    if (body.includes("|") && (/#\s.+/i.test(body) || /day\s*\d+/i.test(body) || /itinerary/i.test(body))) {
      return body;
    }

    // 🔹 Contextual info style
    if (/important contextual information/i.test(body)) {
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

  // 🔹 contextual info
  majorEvent?: string;
  nationalDay?: string;
  weather?: string;
  news?: string;
};

function collectAssistantText(
  messages: Array<{ sender?: string; role?: string; text?: string; content?: string }>
): string {
  return messages
    .filter(m => m.role === "assistant" || m.sender === "bot")
    .map(m => (m.content ?? m.text ?? "").toString())
    .join("\n");
}

function clean(txt: string): string {
  return txt
    .replace(/\*\*/g, "")            // buang ** bold
    .replace(/\*/g, "")              // buang * miring
    .replace(/^\s*[-\d.]+\s*/gm, "") // buang bullet list (-, 1., 2., dll.)
    .trim();
}

/** Parse itinerary modeled (markdown) ke struktur */
function parseModeledItinerary(md: string): ParsedItinerary {
  const out: ParsedItinerary = {};

  // Title H1
  const titleMatch = md.match(/^\s*#\s+(.+)\s*$/m);
  if (titleMatch) out.title = titleMatch[1].trim();

  // Key-Value lines (support bold **Key**, normal Key, dash, colon)
  const kvRegex = /^\s*(?:\*\*)?(.+?)(?:\*\*)?\s*[:\-]\s*(.+)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = kvRegex.exec(md)) !== null) {
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (key.includes("accommodation")) out.accommodation = val;
    else if (key.includes("transport") || key.includes("transportation")) out.transportType = val;
    else if (key.includes("daily budget") || key.includes("budget per day")) out.dailyBudget = val;
  }


  // Extract tables
  const tables = extractTablesFromMarkdown(md);
  if (tables.length > 0) out.itineraryTable = tables[0];
  if (tables.length > 1) out.transportTable = tables[1];

  // Transport docs heading
  const transTitle = md.match(/^\s*##\s+Transportation Logistics Documentation\s*$/mi);
  if (transTitle) out.transportDocTitle = "Transportation Logistics Documentation";

  // Budget summary block
  const budgetBlock = md.match(
    /(?:\*\*)?(?:BUDGET\s*SUMMARY|Budget\s*Summary|TOTAL\s*COST|Total\s*Cost)(?:\*\*)?[\s\S]*?(?=\n\n|\n#|$)/i
  );
  if (budgetBlock) {
    out.budgetSummaryTitle = "BUDGET SUMMARY";
    const block = budgetBlock[0];
    const lineRegex = /(?:\*\*(.+?)\*\*\s*:|\*\*?(.+?)\*\*?\s*:|\-\s*(.+?):)\s*(.+)$/gm;
    const lines: Array<{ label: string; value: string }> = [];
    let lm: RegExpExecArray | null;
    while ((lm = lineRegex.exec(block)) !== null) {
      const label = (lm[1] || lm[2] || lm[3] || "").trim();
      const value = (lm[4] || "").trim();
      if (label && value) {
        lines.push({ label, value });
      }
    }
    out.budgetLines = lines;
  }

  // 🔹 Contextual info parsing
  const getBlock = (labels: string[]): string | undefined => {
    const joined = labels.join("|");
    const regex = new RegExp(
      `(?:${joined})[^:]*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:National holidays|Major local events|Typical weather forecast|Latest news update)[^:]*:|\\n\\n|$)`,
      "i"
    );
    const m = md.match(regex);
    return m ? clean(m[1]) : undefined;  // 🔹 apply clean sebelum return
  };

  out.nationalDay = getBlock(["National holidays", "National holidays during your dates"]);
  out.majorEvent = getBlock(["Major local events", "Major local events/festivals"]);
  out.weather = getBlock(["Typical weather forecast", "Typical weather forecast for those dates"]);
  out.news = getBlock(["Latest news update", "Latest news update for your destination"]);

  return out;
}



function extractConversationMeta(
  messages: Array<{ sender?: string; role?: string; text?: string; content?: string }>,
  fallbackDestination?: string
) {
  const all = messages.map(m => (m.text ?? m.content ?? '')).join('\n');

  // Dates: support multiple formats
  let dates = "Not specified";

  // Format 1: "October 10, 2025 - October 13, 2025"
  let m = all.match(/([A-Z][a-z]+ \d{1,2}, \d{4})\s*(?:-|to|until)\s*([A-Z][a-z]+ \d{1,2}, \d{4})/);
  if (m) {
    dates = `${m[1]} - ${m[2]}`;
  } else {
    // Format 2: "3-5 October 2025" atau "3 - 5 October 2025"
    m = all.match(/(\d{1,2})\s*-\s*(\d{1,2})\s*([A-Z][a-z]+)\s*(\d{4})/i);
    if (m) {
      dates = `${m[1]} ${m[3]} ${m[4]} - ${m[2]} ${m[3]} ${m[4]}`;
    } else {
      // Format 3: "Oct 3-5, 2025" / "Okt 3-5, 2025"
      m = all.match(/([A-Z][a-z]+|Okt|Oktober)\s*(\d{1,2})\s*-\s*(\d{1,2}),?\s*(\d{4})/i);
      if (m) {
        dates = `${m[1]} ${m[2]}, ${m[4]} - ${m[1]} ${m[3]}, ${m[4]}`;
      }
    }
  }

  // Persons: "2 adults" / "3 people" / "4 travelers"
  const p = all.match(/(\d+)\s*(adults?|people|persons?|travellers?|travelers?|orang)/i);
  const persons = p ? `${p[1]} ${p[2]}` : '1 person';

  // Destination: coba dari H1 title dulu, kalau tidak ada, tebak dari kata kunci
  let destination = fallbackDestination || 'Destination';
  const title = all.match(/^\s*#\s+(.+?)\s*$/m)?.[1];
  if (title) {
    destination = title.replace(/travel\s*planner/i, '').trim();
  } else {
    const d = all.match(
      /\b(Bali|Jakarta|Tokyo|Paris|London|Singapore|Bangkok|Rome|New York|Barcelona|Cairo|Sydney)\b/i
    );
    if (d) destination = d[0];
  }

  return { destination, dates, persons };
}


export function exportModeledItineraryToPDF(
  messages: Array<{ sender?: string; role?: string; text?: string; content?: string }>,
  filename = "itinerary.pdf"
) {
  const allMd = collectAssistantText(messages);
  if (!allMd) return console.warn("No assistant messages found");

  const parsed = parseModeledItinerary(allMd);
  const meta = extractConversationMeta(messages, parsed.title);

  const doc = new jsPDF({ orientation: "landscape" }) as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== PAGE 1: Header =====
  doc.setFillColor(153, 51, 255); // sama seperti warna tabel
  doc.rect(0, 0, pageWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TRAVEL PLANNER", pageWidth / 2, 14, { align: "center" });

  doc.setTextColor(0, 0, 0);

  doc.autoTable({
    body: [
      ["Date", meta.dates],
      ["Country", meta.destination],
      ["Person", meta.persons],
    ],
    startY: 30,
    theme: "grid",
    styles: { fontSize: 11, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35 },
      1: { halign: "left" },
    },
  });

  let y = doc.lastAutoTable?.finalY || 50;

  // Information detail
  doc.setFillColor(153, 51, 255);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.autoTable({
    body: [["Information Detail"]],
    startY: y + 5,
    theme: "plain",
    styles: { fontSize: 12, halign: "center", fillColor: [153, 51, 255], textColor: 255 },
  });

  y = doc.lastAutoTable?.finalY || y + 15;

  const detailRows = [
    ["Major Event", ":", parsed.majorEvent || "Not specified"],
    ["National Day", ":", parsed.nationalDay || "Not specified"],
    ["Weather", ":", parsed.weather || "Not specified"],
    ["News", ":", parsed.news || "Not specified"],
  ];

  doc.setTextColor(0, 0, 0);
  doc.autoTable({
    body: detailRows,
    startY: y + 5,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2, valign: "top", overflow: "linebreak" },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 30 },
      1: { cellWidth: 4, halign: "center" },
      2: { cellWidth: pageWidth - 50 },
    },
  });

  // ===== ITINERARY =====
  if (parsed.itineraryTable) {
    const dayCol = parsed.itineraryTable.headers.findIndex((h) =>
      h.toLowerCase().includes("day")
    );
    const priceCol = parsed.itineraryTable.headers.findIndex((h) =>
      h.toLowerCase().includes("price")
    );

    const dayGroups: Record<string, string[][]> = {};
    parsed.itineraryTable.rows.forEach((row, i) => {
      let dayLabel = Object.keys(dayGroups).pop() || "Day 1";
      if (dayCol >= 0 && row[dayCol]) {
        const raw = row[dayCol].toString().trim();
        if (/^day\s*\d+$/i.test(raw)) {
          // hanya kalau formatnya "Day X"
          dayLabel = raw;
        }
      }
      if (!dayGroups[dayLabel]) dayGroups[dayLabel] = [];
      dayGroups[dayLabel].push(row);
    });

    const sortedDays = Object.keys(dayGroups).sort(
      (a, b) =>
        parseInt(a.replace(/\D/g, "0")) - parseInt(b.replace(/\D/g, "0"))
    );

    // Export itinerary per day (tanpa header "DAY X")
    sortedDays.forEach((day) => {
      doc.addPage();
      doc.autoTable({
        head: [parsed.itineraryTable!.headers],
        body: dayGroups[day],
        startY: 20,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [153, 51, 255], textColor: 255 },
      });
    });

  // ===== BUDGET SUMMARY =====
    function parsePrice(val: string): number {
      const m = val.match(/[\d,]+/g);
      if (!m) return 0;
      return parseInt(m[0].replace(/,/g, ""), 10);
    }

    let total = 0;
    const dayTotals: Record<string, number> = {};

    if (parsed.itineraryTable) {
      const priceCol = parsed.itineraryTable.headers.findIndex(h =>
        h.toLowerCase().includes("price")
      );
      const dayCol = parsed.itineraryTable.headers.findIndex(h =>
        h.toLowerCase().includes("day")
      );

      parsed.itineraryTable.rows.forEach(row => {
        if (priceCol >= 0 && row[priceCol]) {
          const price = parsePrice(row[priceCol]);
          total += price;

          let dayLabel = dayCol >= 0 && row[dayCol] ? row[dayCol].toString().trim() : "";
          if (!/^day\s*\d+$/i.test(dayLabel)) {
            dayLabel = "Other";
          }
          if (!dayTotals[dayLabel]) dayTotals[dayLabel] = 0;
          dayTotals[dayLabel] += price;
        }
      });
    }

    const numDays = Object.keys(dayTotals).filter(d => /^day\s*\d+/i.test(d)).length || 1;
    const totalStr = `$${total.toLocaleString()}`;
    const avgStr = `$${Math.round(total / numDays).toLocaleString()}`;

    // Buat tabel breakdown
    const finalBudget: string[][] = [
      ["Total Estimated Cost", ":", totalStr],
      ["Daily Average Per Person", ":", avgStr],
      ["Breakdown by Category", "", ""],
      ["Accommodation", ":", parsed.accommodation || "Not specified"],
      ["Transportation", ":", parsed.transportType || "Not specified"],
      ["Activities & Attractions", ":", "See itinerary"],
    ];

    Object.keys(dayTotals).forEach(day => {
      if (/^day\s*\d+/i.test(day)) {
        finalBudget.push([day, ":", `$${dayTotals[day].toLocaleString()}`]);
      }
    });

    // === RENDER ===
    doc.addPage();
    doc.setFillColor(153, 51, 255); // sama seperti warna tabel
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("BUDGET SUMMARY", pageWidth / 2, 14, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.autoTable({
      body: finalBudget,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 4 },
      headStyles: { fillColor: [153, 51, 255], textColor: 255 }, // senada
      columnStyles: {
        0: { fontStyle: "bold", halign: "left" },
        1: { halign: "center", cellWidth: 5 },
        2: { halign: "right" },
      },
    });


  }

  // ===== SAVE FILE =====
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
