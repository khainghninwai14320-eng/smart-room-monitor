'use client';

import { useEffect, useState } from 'react';

interface AlertLog {
  id: number;
  time: string;
  type: string;
  level: string;
  msg: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://172.20.10.6:8000/api/latest';

export default function AlertsPage() {
  const [alertsLogs, setAlertsLogs] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAlertsLogs = async () => {
      try {
        const res = await fetch(API_BASE_URL);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();

        if (!cancelled) {
          setAlertsLogs(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching alerts logs:', err);
          setError('Unable to load alerts from the API.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAlertsLogs();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-600">Loading alerts logs...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Alerts</h1>
      <div className="grid gap-4">
        {alertsLogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            No alerts available.
          </div>
        ) : (
          alertsLogs.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{alert.type}</h2>
                  <p className="text-sm text-slate-500">{alert.time}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                  {alert.level}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700">{alert.msg}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}