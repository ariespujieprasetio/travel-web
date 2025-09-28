"use client"
// src/components/TableExportButton.tsx
import { useState, useRef, useEffect } from 'react'
import { 
  exportTablesFromMarkdown, 
  containsMarkdownTable 
} from '@/src/services/exportService'

type ExportFormat = 'csv' | 'xlsx' | 'pdf'

interface TableExportButtonProps {
  messageText: string
  filename?: string
  className?: string
}

export default function TableExportButton({ 
  messageText, 
  filename = 'travel_data',
  className = ''
}: TableExportButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Check if message contains a table
  const hasTable = containsMarkdownTable(messageText)
  
  // Handle export operation
  const handleExport = async (format: ExportFormat) => {
    try {
      if (!hasTable) {
        setExportError('No table found in the message.')
        setTimeout(() => setExportError(null), 3000)
        return
      }
      
      setIsExporting(true)
      setExportFormat(format)
      setExportError(null)
      
      // Slight delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Export the table
      exportTablesFromMarkdown(messageText, format, filename)
      
      // Close expanded view after export
      setTimeout(() => {
        setIsExpanded(false)
        setExportFormat(null)
      }, 1000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportError('Export failed. Please try again.')
      setTimeout(() => setExportError(null), 3000)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Close expanded view when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  if (!hasTable) return null
  
  return (
    <div 
      className={`relative inline-flex items-center transition-all duration-300 ${isExpanded ? 'gap-2' : 'gap-0'}`} 
      ref={containerRef}
    >
      {/* Main button */}
      {/* <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all ${className} ${isExporting ? 'opacity-80 cursor-not-allowed' : ''}`}
        disabled={isExporting}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {isExporting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {exportFormat ? `Exporting as ${exportFormat.toUpperCase()}...` : 'Exporting...'}
          </span>
        ) : (
          <span>Export Table</span>
        )}
      </button> */}
      
      {/* Expanded format buttons */}
      {isExpanded && !isExporting && (
        <>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-purple-50 transition-all animate-fadeIn shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">CSV</span>
          </button>
          
          <button
            onClick={() => handleExport('xlsx')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-purple-50 transition-all animate-fadeIn shadow-sm"
          >
            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">XLSX</span>
          </button>
          
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-purple-50 transition-all animate-fadeIn shadow-sm"
          >
            <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">PDF</span>
          </button>
        </>
      )}
      
      {/* Error message */}
      {exportError && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 text-red-700 rounded shadow-md text-sm">
          {exportError}
        </div>
      )}
    </div>
  )
}