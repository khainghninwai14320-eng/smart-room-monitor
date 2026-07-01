import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/sidebar";
export const metadata: Metadata = {
 title: "Smart Room Monitor",
 description: "Monitored by Raspberry Pi 3 Model B+",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
<html lang="en">
<body className="bg-[#f4f6f9] text-slate-800 antialiased">
<div className="flex min-h-screen">
<Sidebar />
<main className="flex-1 ml-64 p-8 overflow-y-auto">
           {children}
</main>
</div>
</body>
</html>
 );
}