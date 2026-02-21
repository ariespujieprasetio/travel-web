'use client'

import { useRouter } from 'next/navigation'
import LogoIcon from '@/src/LogoIcon'
import Typography from '@/src/components/Typography'
import GradientButton from '@/src/components/GradientButton'

export default function PrivacyPage() {
  const router = useRouter()
  
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
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
      <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
          
      <div className="max-w-none text-gray-300">
      <p className="mb-4 text-gray-400">Last updated: March 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">1. Introduction</h2>
            <p>
              Welcome to Velutara. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website
              and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">2. The Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Identity Data includes first name, last name, username or similar identifier.</li>
              <li>Contact Data includes email address and telephone numbers.</li>
              <li>Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li>Usage Data includes information about how you use our website, products and services.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-white">4. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> privacy@velutara.com
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
                © 2025 Velutara. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-600/30 blur-3xl" />
      </footer>
    </div>
  )
}