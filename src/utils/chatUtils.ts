"use client"
// src/utils/chatUtils.ts

/**
 * Represents a chat message
 */
export type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};
export interface ApiMessage {
    role: "user" | "system" | "assistant" | "tool";
    content: string;
  }
  
  /**
   * Format API chat messages to UI chat messages
   * @param apiMessages - Messages from the API
   * @returns Formatted messages for UI display
   */
  export function formatApiMessagesToUiMessages(apiMessages: ApiMessage[]): ChatMessage[] {
    return apiMessages
      .filter(msg => msg.role !== 'system' && msg.role !== 'tool')
      .map(msg => ({
        sender: msg.role === 'user' ? 'user' : 'bot',
        text: msg.content,
      }));
  }
/**
 * Checks if text contains a Markdown table
 * @param text - The text to check
 * @returns True if the text contains a Markdown table
 */
export function containsMarkdownTable(text: string): boolean {
  // This regex checks for:
  // 1. A header row: a line that starts with an optional whitespace, a pipe,
  //    some content, and another pipe.
  // 2. A separator row: a line starting with an optional whitespace, a pipe,
  //    then one or more dashes (or colons for alignment), and at least one more pipe.
  const mdTableRegex = /(?:^\s*\|.*\|.*\r?\n)(?:^\s*\|[\s:-]+\|(?:[\s:-]+\|)*\s*$)/m;
  return mdTableRegex.test(text);
}

/**
 * Extracts Markdown tables from text
 * @param text - The text containing Markdown tables
 * @returns Array of extracted Markdown tables
 */
export function extractMarkdownTables(text: string): string[] {
  // This regex will capture:
  // 1. A header row: a line that starts with a pipe, has content, and another pipe.
  // 2. A separator row: a line starting with a pipe and containing groups of dashes (optionally with colons)
  // 3. Zero or more additional rows that start with a pipe.
  const tableRegex = /(^\|.*\|.*\r?\n)(^\|(?:\s*:?-+:?\s*\|)+\s*\r?\n)((?:^\|.*\|.*\r?\n)*)/gm;
  const matches: string[] = [];
  let match;

  while ((match = tableRegex.exec(text)) !== null) {
    // match[0] is the entire table block.
    matches.push(match[0].trim());
  }

  return matches;
}

/**
 * Converts a Markdown table to CSV format
 * @param markdown - The Markdown table string
 * @returns CSV formatted string
 */
export function mdTableToCSV(markdown: string): string {
  // Split the string into individual rows.
  const rows = markdown.split(/\r?\n/).filter(row => row.trim() !== "");

  // Remove the separator row if it exists.
  // This row typically contains dashes and optional colons.
  const dataRows = rows.filter(row => !/^\s*\|?\s*:?-+:?\s*\|/.test(row));

  // Convert each row.
  const csvRows = dataRows.map(row => {
    // Remove any leading or trailing pipes.
    let trimmed = row.trim();
    if (trimmed.startsWith("|")) {
      trimmed = trimmed.substring(1);
    }
    if (trimmed.endsWith("|")) {
      trimmed = trimmed.substring(0, trimmed.length - 1);
    }
    // Split the row into cells.
    const cells = trimmed.split("|").map(cell => cell.trim());
    // Escape any cell that contains commas or quotes.
    const escapedCells = cells.map(cell => {
      if (cell.includes(",") || cell.includes('"')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    return escapedCells.join(",");
  });

  return csvRows.join("\n");
}

/**
 * Triggers a download for the provided CSV content.
 * @param csvContent - The CSV data as a string.
 * @param filename - The filename for the downloaded CSV file.
 */
export function downloadCSVFile(csvContent: string, filename: string = "table.csv"): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const now = new Date();
  const messageDate = new Date(dateString);
  
  // For today's dates, show time
  if (messageDate.toDateString() === now.toDateString()) {
    return `Today at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // For yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // For this week
  const diffTime = Math.abs(now.getTime() - messageDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  // For older dates
  return messageDate.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

