'use client'

import { useRouter } from 'next/navigation'
import LogoIcon from '@/src/LogoIcon'
import Typography from '@/src/components/Typography'
import GradientButton from '@/src/components/GradientButton'

export default function TermsPage() {
  const router = useRouter()
  
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      
      {/* background glow */}
      <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-600/30 blur-3xl" />

      {/* Header */}
      <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <LogoIcon width={24} height={24} color="white" />
              </div>
              <div>
                <Typography variant="h1" className="text-xl font-bold text-white">Velutara</Typography>
                <Typography variant="body2" className="text-gray-400">Your travel AI assistant</Typography>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
          
          <div className="max-w-none text-gray-300">
            <p className="mb-4 text-gray-400">Last updated: March 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using Velutara, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">2. Use License</h2>
            <p>
              Permission is granted to temporarily use Velutara for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose;</li>
              <li>Attempt to decompile or reverse engineer any software contained on Velutara;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or mirror the materials on any other server.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">3. Disclaimer</h2>
            <p>
              The materials on Velutara are provided on an as is basis. Velutara makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions 
              of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">4. Limitations</h2>
            <p>
              In no event shall Velutara or its suppliers be liable for any damages (including, without limitation, damages for loss of data 
              or profit, or due to business interruption) arising out of the use or inability to use the materials on Velutara, 
              even if Velutara or a Velutara authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">5. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> terms@velutara.com
            </p>
          </div>
          
          <div className="mt-8">
            <GradientButton onClick={() => router.back()}>
              Back
            </GradientButton>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative mt-auto py-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-400">
                © 2026 Velutara. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}