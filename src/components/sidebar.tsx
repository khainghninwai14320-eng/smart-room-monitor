'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function Sidebar() {

  const pathname = usePathname();

  const menuItems = [

    { name: 'Dashboard', path: '/' },

    { name: 'History', path: '/history' },

    { name: 'Alerts', path: '/alerts' },

    { name: 'Settings', path: '/settings' },

    { name: 'Device Status', path: '/device-status' },

    { name: 'About', path: '/about' },

  ];

  return (
<div className="w-64 h-8 bg-[#111827] text-gray-300 flex flex-col justify-between p-4 fixed left-0 top-0 border-r border-gray-800">
<div>
<div className="flex items-center gap-3 px-2 py-4 border-b border-gray-800 mb-6">
<div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold">H</div>
<span className="text-lg font-bold text-white tracking-wide">Smart Room Monitor</span>
</div>
<nav className="space-y-1">

          {menuItems.map((item) => {

            const isActive = pathname === item.path;

            return (
<Link key={item.name} href={item.path}

                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${

                  isActive ? 'bg-[#2563eb] text-white shadow-md' : 'hover:bg-gray-800 text-gray-400 hover:text-white'

                }`}>

                {item.name}
</Link>

            );

          })}
</nav>
</div>
<div className="bg-[#1f2937] p-4 rounded-xl border border-gray-800">
<div className="flex items-center justify-between">
<div>
<p className="text-xs text-gray-400 font-medium">Connected Device</p>
<p className="text-sm font-semibold text-white">Raspberry Pi 3</p>
</div>
<span className="flex h-2 w-2 relative">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
</span>
</div>
</div>
</div>

  );

}
 