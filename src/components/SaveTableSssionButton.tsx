// src/components/SaveTableSessionButton.tsx
import React, { useState } from 'react';
import { sessionManager } from '@/src/services/sessionService';
import { toggleSaveSession } from '../services/api';

interface SaveTableSessionButtonProps {
    initialSaveStatus: boolean;
}

const SaveTableSessionButton: React.FC<SaveTableSessionButtonProps> = ({ initialSaveStatus }: { initialSaveStatus: boolean }) => {
    const [isSaved, setIsSaved] = useState<boolean>(initialSaveStatus);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    // Handle saving the session
    const handleSaveSession = async () => {
        if (isSaved) return;

        try {
            setIsLoading(true);
            setError(null);

            const sessionId = sessionManager.getCurrentSessionId();
            if (!sessionId) {
                throw new Error('No active session');
            }

            const updatedSession = await toggleSaveSession(sessionId);

            setIsSaved(updatedSession.save || false);

            //   // Call the callback if provided
            //   if (onStatusChange) {
            //     onStatusChange(updatedSession.save || false);
            //   }

            // Show tooltip and hide after 3 seconds
            setShowTooltip(true);
            setTimeout(() => {
                setShowTooltip(false);
            }, 3000);

            setIsLoading(false);
        } catch (err) {
            console.error('Failed to save session with table:', err);
            setError('Failed to save session');
            setIsLoading(false);
        }
    };

    // If no table is detected or already saved, don't render
    if (isSaved) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={handleSaveSession}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200 animate-pulse'
                    }`}
                title="Table detected! Save this chat"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Table Detected! Save This Chat</span>
                    </>
                )}
            </button>

            {showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-green-100 text-green-800 text-sm rounded-md shadow-md z-10 whitespace-nowrap">
                    Chat saved successfully! ✓
                </div>
            )}

            {error && (
                <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-red-100 text-red-800 text-sm rounded-md shadow-md z-10">
                    {error}
                </div>
            )}
        </div>
    );
};

export default SaveTableSessionButton;