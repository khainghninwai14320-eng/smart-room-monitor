'use client';

import { useEffect, useState } from 'react';

interface LatestData {
  alertLevel: string;
  alerts: string[];
  createdAt: string;
}

export default function AlertsPage() {
  const [data, setData] = useState<LatestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error('API URL is not configured');
        }

        const response = await fetch(`${API_BASE_URL}/api/latest`);

        if (!response.ok) {
          throw new Error('Failed to fetch alert data');
        }

        const result: LatestData = await response.json();

        setData(result);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Cannot load alert data from Raspberry Pi.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);

    return () => clearInterval(interval);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Alerts
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Current room environment alerts
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500">
          Current Alert Level
        </p>

        <div className="mt-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
              data.alertLevel === 'High'
                ? 'bg-rose-100 text-rose-700'
                : data.alertLevel === 'Medium'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {data.alertLevel}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-3">
          Last updated: {data.createdAt}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">
            Current Alerts
          </h2>
        </div>

        {data.alerts.length === 0 ? (
          <div className="p-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="font-semibold text-emerald-700">
                No alerts
              </p>

              <p className="text-sm text-emerald-600 mt-1">
                The room environment is currently normal.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.alerts.map((alert, index) => (
              <div
                key={index}
                className="p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {alert}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {data.createdAt}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    data.alertLevel === 'High'
                      ? 'bg-rose-100 text-rose-700'
                      : data.alertLevel === 'Medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {data.alertLevel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}