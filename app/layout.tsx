import type { Metadata } from "next";
import "./globals.css";
import { roboto_mono } from "./fonts";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "VELUTARA",
  description: "",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🚀 Client-side effect to hide hydration warnings
  if (typeof window !== "undefined") {
    const error = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("hydration")) {
        return;
      }
      error(...args);
    };
  }

  return (
    <html lang="en">
      <head>
        {/* Travelpayouts verification script */}
        <script
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          dangerouslySetInnerHTML={{
            __html: `(function () {
              var script = document.createElement("script");
              script.async = 1;
              script.src = 'https://emrld.ltd/NDU4NzE5.js?t=458719';
              document.head.appendChild(script);
            })();`,
          }}
        />
      </head>
      <body className={`${roboto_mono.className} antialiased row`}>
        <main className="w-full bg-gray-100 min-h-full">{children}</main>
      </body>
    </html>
  );
}
