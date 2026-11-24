
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://192.168.0.47:8000';

const menuItems = [
  { name: 'ダッシュボード', path: '/' },
  { name: '履歴', path: '/history' },
  { name: 'アラート', path: '/alerts' },
  { name: '設定', path: '/settings' },
  { name: 'デバイス状態', path: '/device-status' },
  { name: 'システム情報', path: '/about' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPiOnline, setIsPiOnline] = useState(false);

  // Raspberry Pi Online / Offline Check
  useEffect(() => {
    let active = true;

    const checkPiStatus = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/device-status`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error('Connection failed');
        }

        const data = await response.json();

        if (active) {
          setIsPiOnline(data.status === 'Online');
        }
      } catch (error) {
        if (active) {
          setIsPiOnline(false);
        }
      }
    };

    checkPiStatus();

    const interval = setInterval(checkPiStatus, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Close Mobile Menu When Page Changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const MenuContent = () => (
    <>
      <div>
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/smart-room-logo.png"
              alt="Smart Room Monitor Logo"
              width={60}
              height={60}
              className="w-15 h-15 object-contain"
            />
          </div>

          <div>
            <p className="font-bold text-slate-900 leading-tight">
              Smart Room
            </p>
            <p className="font-bold text-slate-900 leading-tight">
              Monitor
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  block rounded-2xl px-4 py-3
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Raspberry Pi Connection Status */}
      <div className="bg-white/80 border border-white rounded-2xl p-4 shadow-sm">
        <p className="text-[14px] text-slate-600">
          接続中のデバイス
        </p>

        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-semibold text-slate-800">
            Raspberry Pi 3
          </p>

          <span
            title={isPiOnline ? 'Online' : 'Offline'}
            className={`w-2.5 h-2.5 rounded-full ${
              isPiOnline
                ? 'bg-emerald-500'
                : 'bg-rose-500'
            }`}
          />
        </div>

        <p
          className={`text-xs mt-2 ${
            isPiOnline
              ? 'text-emerald-600'
              : 'text-rose-600'
          }`}
        >
          {isPiOnline ? 'オンライン' : 'オフライン'}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="
          hidden md:flex
          fixed left-4 top-4 bottom-4
          w-64
          rounded-[30px]
          px-4 py-5
          flex-col justify-between
          bg-white/55
          backdrop-blur-xl
          border border-white/70
          shadow-[0_20px_60px_rgba(77,91,145,0.12)]
          z-40
        "
      >
        <MenuContent />
      </aside>

      {/* Mobile Top Bar */}
      <header
        className="
          md:hidden
          fixed top-3 left-3 right-3
          h-16
          rounded-2xl
          bg-white/80
          backdrop-blur-xl
          border border-white
          shadow-lg
          flex items-center justify-between
          px-4
          z-50
        "
      >
        <div className="flex items-center gap-3">
          <img
            src="/smart-room-logo.png"
            alt="Smart Room Monitor Logo"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />

          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              Smart Room
            </p>

            <p className="text-xs text-slate-500">
              Monitor
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="
            w-10 h-10
            rounded-xl
            bg-slate-900
            text-white
            flex items-center justify-center
            text-xl
          "
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {/* Mobile Dark Overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
          className="
            md:hidden
            fixed inset-0
            bg-slate-950/35
            backdrop-blur-sm
            z-50
          "
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`
          md:hidden
          fixed top-0 left-0 bottom-0
          w-[82%] max-w-[320px]
          bg-[#f7f9ff]
          border-r border-white
          shadow-2xl
          px-5 py-6
          flex flex-col justify-between
          z-[60]
          transition-transform duration-300
          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="
            absolute top-5 right-5
            w-9 h-9 rounded-xl
            bg-white
            border border-slate-200
            shadow-sm
            text-slate-600
          "
          aria-label="Close menu"
        >
          ×
        </button>

        <MenuContent />
      </aside>
    </>
  );
}
