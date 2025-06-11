// RootLayout.tsx
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Your layout components, wrappers, or structure */}
      {children}
    </>
  );
}
