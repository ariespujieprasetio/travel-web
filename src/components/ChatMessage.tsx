"use client"
import { useState, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import LogoIcon from '@/src/LogoIcon'
import TableExportButton from './TableExportButton'
import DocumentIndicator from './DocumentIndicator'
import { containsMarkdownTable } from '@/src/services/exportService'
import SaveTableSessionButton from './SaveTableSssionButton'
import { sessionManager } from '../services/sessionService'

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant' | 'tool'
    content: string
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const sender = message.role === 'user' ? 'user' : 'bot'
  const text = message.content

  const hasTable = containsMarkdownTable(text)
  const [showExportTools, setShowExportTools] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)
  const session = sessionManager.getCurrentSessionSaved()

  const isDocumentMessage = text.includes('[Uploaded ') && text.includes('file:')

  const extractDocumentInfo = () => {
    if (!isDocumentMessage) return null

    const regex = /\[Uploaded ([A-Z]+) file: (.*?)\]/
    const match = text.match(regex)

    if (match && match.length >= 3) {
      const fileExtension = match[1]
      const fileName = match[2]

      let fileType = 'application/octet-stream'
      switch (fileExtension.toLowerCase()) {
        case 'pdf':
          fileType = 'application/pdf'
          break
        case 'docx':
          fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break
        case 'doc':
          fileType = 'application/msword'
          break
        case 'jpg':
        case 'jpeg':
          fileType = 'image/jpeg'
          break
        case 'png':
          fileType = 'image/png'
          break
        case 'gif':
          fileType = 'image/gif'
          break
        case 'bmp':
          fileType = 'image/bmp'
          break
        case 'tiff':
          fileType = 'image/tiff'
          break
      }

      const isProcessing = text.includes('Processing document...')

      return { fileType, fileName, isProcessing }
    }

    return null
  }

  const documentInfo = extractDocumentInfo()

  const handleMouseEnter = () => {
    if (hasTable) {
      setShowExportTools(true)
    }
  }

  const handleMouseLeave = () => {
    setShowExportTools(false)
  }

  return (
    <div
      className={`${hasTable ? 'w-full' : 'max-w-3xl'} ${sender === "user" ? "ml-auto" : "mr-auto"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={messageRef}
    >
      <div className="flex gap-1 items-center">
        <LogoIcon width={20} height={20} color={sender === "user" ? "#6366F1" : "#1F2937"} />
        <h3 className="font-semibold">
          {sender === "user" ? "You" : "Travel Assistant"}
        </h3>
        {documentInfo && (
          <DocumentIndicator
            fileType={documentInfo.fileType}
            fileName={documentInfo.fileName}
          />
        )}
      </div>

      <div
        className={`mt-1 p-4 rounded-lg ${sender === "user"
          ? "bg-indigo-100 text-gray-800"
          : "bg-white text-gray-700 shadow-sm"
          }`}
      >
        {isDocumentMessage ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium flex items-center">
                <svg className="w-5 h-5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Document uploaded
              </p>

              {documentInfo && !documentInfo.isProcessing && (
                <div className="flex text-sm">
                  <button
                    className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
                    title="View document"
                    onClick={() => {
                      const element = document.createElement('div');
                      element.innerHTML = text;
                      window.getSelection()?.selectAllChildren(element);
                      document.execCommand('copy');
                      window.getSelection()?.removeAllRanges();
                      alert('Document content copied to clipboard!');
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                </div>
              )}
            </div>

            {documentInfo?.isProcessing ? (
              <div className="flex items-center text-gray-500 text-sm">
                <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                Processing document content...
              </div>
            ) : (
              <div className="text-sm max-h-60 overflow-y-auto whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                {text.split("Content:")[1]?.trim() || "Processing document content..."}
              </div>
            )}
          </div>
        ) : (
          <Markdown
            components={{
              table: ({ ...props }) => (
                <div className="my-3 overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-200 table-auto" {...props} />
                </div>
              ),
              thead: ({ ...props }) => (
                <thead className="bg-gray-100" {...props} />
              ),
              tbody: ({ ...props }) => (
                <tbody className="bg-white divide-y divide-gray-200" {...props} />
              ),
              th: ({ ...props }) => (
                <th className="px-4 py-3 border border-gray-200 text-left text-sm font-medium text-gray-700" {...props} />
              ),
              td: ({ ...props }) => (
                <td className="px-4 py-3 border border-gray-200 text-sm text-gray-900" {...props} />
              ),
            }}
            remarkPlugins={[remarkGfm]}
          >
            {text}
          </Markdown>
        )}

        {hasTable && (
          <div className={`mt-4 transition-opacity duration-200 ${showExportTools ? 'opacity-100' : 'opacity-60'}`}>
            <SaveTableSessionButton initialSaveStatus={session} />
            <TableExportButton
              messageText={text}
              filename="travel_itinerary"
            />
          </div>
        )}
      </div>
    </div>
  )
}
