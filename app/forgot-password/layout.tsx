import React, { Suspense } from 'react'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense>
            <body>{children}</body>
        </Suspense>
    )
}
