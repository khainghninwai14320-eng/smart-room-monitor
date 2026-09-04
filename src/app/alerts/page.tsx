'use client';

import { useEffect, useState } from 'react';

interface LatestData {
  alertLevel: string;
  alerts: string[];
  createdAt: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://172.20.10.6:8000/api/latest';

export default function AlertsPage() {
  const [data, setData] = useState<LatestData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://172.20.10.6:8000/api/latest';

  useEffect(() => {
    const fetchAlertsLogs = async () => {
      try {
        const res = await fetch(API_BASE_URL);
        const data = await res.json();
        setAlertsLogs(data);
      } catch (error) {
        console.error('Error fetching alerts logs:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAlertsLogs();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading alert data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl">
        <h3 className="font-bold">Alert Error</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Alert Logs</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Alert</th>
              <th className="p-4">Level</th>
              <th className="p-4">Message</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {alertsLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400">
                  No systematic incidents logged.
                </td>
              </tr>
            ) : (
              alertsLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-500">{log.time}</td>
                  <td className="p-4 font-semibold text-slate-700">{log.type}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        log.level === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : log.level === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{log.msg}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}