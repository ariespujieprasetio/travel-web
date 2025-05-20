"use client"
// src/components/TableExportDialog.tsx
import { useState, useEffect, Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { exportTablesFromMarkdown } from '@/src/services/exportService'

type ExportFormat = 'csv' | 'xlsx' | 'pdf'

interface TableExportDialogProps {
    isOpen: boolean
    onClose: () => void
    messageText: string
    tableName?: string
}

export default function TableExportDialog({
    isOpen,
    onClose,
    messageText,
    tableName = 'Table'
}: TableExportDialogProps) {
    const [filename, setFilename] = useState(`${tableName.toLowerCase().replace(/\s+/g, '_')}`)
    const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')
    const [isExporting, setIsExporting] = useState(false)
    const [includeTimestamp, setIncludeTimestamp] = useState(true)

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            console.log('called?')
            setFilename(`${tableName.toLowerCase().replace(/\s+/g, '_')}`)
            setExportFormat('csv')
            setIsExporting(false)
            setIncludeTimestamp(true)
        }
    }, [isOpen, tableName])

    const handleExport = async () => {
        try {
            setIsExporting(true)

            // Add timestamp if selected
            let finalFilename = filename
            if (includeTimestamp) {
                const date = new Date()
                const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
                finalFilename = `${filename}_${timestamp}`
            }

            // Perform export
            await new Promise(resolve => setTimeout(resolve, 500)) // Artificial delay for UI feedback
            exportTablesFromMarkdown(messageText, exportFormat, finalFilename)

            // Close dialog
            setIsExporting(false)
            onClose()
        } catch (error) {
            console.error('Export failed:', error)
            setIsExporting(false)
            // Could add error message here
        }
    }
    return (
        <Dialog as="div" open={isOpen} className="relative z-50" onClose={onClose}>

            <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                Export Table
                            </DialogTitle>

                            <div className="mt-4 space-y-4">
                                {/* Filename input */}
                                <div>
                                    <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-1">
                                        Filename
                                    </label>
                                    <input
                                        type="text"
                                        id="filename"
                                        value={filename}
                                        onChange={(e) => setFilename(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter filename"
                                    />
                                </div>

                                {/* Export format selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Export Format
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setExportFormat('csv')}
                                            className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-md transition-colors ${exportFormat === 'csv'
                                                ? 'bg-purple-100 border-purple-300 text-purple-800'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M9 17v-5m3 5v-1m3 1v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            CSV
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setExportFormat('xlsx')}
                                            className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-md transition-colors ${exportFormat === 'xlsx'
                                                ? 'bg-green-100 border-green-300 text-green-800'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M8 12l3 3 3-3m-6 0l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            XLSX
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setExportFormat('pdf')}
                                            className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-md transition-colors ${exportFormat === 'pdf'
                                                ? 'bg-red-100 border-red-300 text-red-800'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M8 17v-5M12 17v-2M16 17v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Options */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={includeTimestamp}
                                            onChange={(e) => setIncludeTimestamp(e.target.checked)}
                                            className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Include timestamp in filename</span>
                                    </label>
                                </div>

                                {/* Preview */}
                                <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                                    <div className="font-medium text-gray-700">Output Preview:</div>
                                    <div className="mt-1 font-mono text-gray-600 break-all">
                                        {filename}{includeTimestamp ? '_[timestamp]' : ''}.{exportFormat}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${isExporting
                                        ? 'bg-purple-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                        }`}
                                    onClick={handleExport}
                                    disabled={isExporting || !filename.trim()}
                                >
                                    {isExporting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Exporting...
                                        </span>
                                    ) : (
                                        `Export as ${exportFormat.toUpperCase()}`
                                    )}
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    )
}