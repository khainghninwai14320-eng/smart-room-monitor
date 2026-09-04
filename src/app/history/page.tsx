'use client';

import { useEffect, useState } from 'react';

interface HistoryData {
  id?: number;
  temperature: number;
  humidity: number;
  studyScore: number;
  sleepScore: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error('API URL is not configured');
        }

        const response = await fetch(`${API_BASE_URL}/api/history`);

        if (!response.ok) {
          throw new Error('Failed to fetch history data');
        }

        const result: HistoryData[] = await response.json();

        setHistory(result);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Cannot load history data from Raspberry Pi.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading history data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl">
        <h3 className="font-bold">History Error</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          History
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Past room environment data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Temperature
          </p>

          <p className="text-xl font-bold text-amber-500 mt-2">
            History
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Humidity
          </p>

          <p className="text-xl font-bold text-sky-500 mt-2">
            History
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Study Score
          </p>

          <p className="text-xl font-bold text-amber-500 mt-2">
            History
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Sleep Score
          </p>

          <p className="text-xl font-bold text-emerald-500 mt-2">
            History
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">
            Sensor History
          </h2>
        </div>

        {history.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No history data available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Temperature</th>
                  <th className="p-3 text-left">Humidity</th>
                  <th className="p-3 text-left">Study Score</th>
                  <th className="p-3 text-left">Sleep Score</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {history.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <td className="p-3">
                      {item.createdAt}
                    </td>

                    <td className="p-3">
                      {item.temperature} °C
                    </td>

                    <td className="p-3">
                      {item.humidity} %
                    </td>

                    <td className="p-3">
                      {item.studyScore}
                    </td>

                    <td className="p-3">
                      {item.sleepScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}