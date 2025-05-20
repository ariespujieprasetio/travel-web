'use client'

import { useRouter } from 'next/navigation'
import LogoIcon from '@/src/LogoIcon'
import Typography from '@/src/components/Typography'
import GradientButton from '@/src/components/GradientButton'

export default function TermsPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <LogoIcon width={24} height={24} color="white" />
              </div>
              <div>
                <Typography variant="h1" className="text-xl font-bold">Velutara</Typography>
                <Typography variant="body2" className="text-gray-500">Your travel AI assistant</Typography>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">Last updated: March 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using Velutara, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Use License</h2>
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
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Disclaimer</h2>
            <p>
              The materials on Velutara are provided on an as is basis. Velutara makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions 
              of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Limitations</h2>
            <p>
              In no event shall Velutara or its suppliers be liable for any damages (including, without limitation, damages for loss of data 
              or profit, or due to business interruption) arising out of the use or inability to use the materials on Velutara, 
              even if Velutara or a Velutara authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Contact</h2>
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
      <footer className="mt-auto py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-500">
                © 2025 Velutara. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}