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

        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/75 border border-white/80 shadow-md text-slate-900'
                    : 'text-slate-600 hover:bg-white/45 hover:text-slate-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="glass-card rounded-[24px] p-4">
        <p className="text-xs text-slate-500">Connected Device</p>

        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold text-slate-900">Raspberry Pi 3</p>
          <span className="status-dot-green"></span>
        </div>
      </div>
    </aside>
  );
}