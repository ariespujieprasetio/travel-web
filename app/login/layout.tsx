// app/login/layout.tsx
import Script from 'next/script';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
        async
        defer
      />
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    </>
  );
}