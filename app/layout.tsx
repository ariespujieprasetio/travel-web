import type { Metadata } from "next";
import "./globals.css";
import { roboto_mono } from "./fonts";

export const metadata: Metadata = {
  title: "VELUTARA",
  description: "",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto_mono.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}