import type { Metadata } from "next";
import "./globals.css";
import { roboto_mono } from "./fonts";



export const metadata: Metadata = {
  title: "VELUTARA",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto_mono.className} antialiased row`}
      >
          <main className="w-full  bg-gray-100 min-h-full">
            {children}
          </main>
      </body>
    </html>
  );
}
