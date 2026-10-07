import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/sidebar";

export const metadata: Metadata = {
  title: "Smart Room Monitor",
  description: "Monitored by Raspberry Pi 3 Model B+",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-slate-800 antialiased overflow-x-hidden">
        <div className="min-h-screen">
          <Sidebar />

          <main
            className="
              min-h-screen
              pt-24 px-4 pb-6
              md:ml-72 md:pt-8 md:px-8 md:pb-8
              overflow-x-hidden
            "
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}