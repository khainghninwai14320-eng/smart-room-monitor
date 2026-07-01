'use client';

import { useEffect, useState } from 'react';

interface SensorData {
  temperature: number;
  humidity: number;
  studyScore: number;
  sleepScore: number;
  time: string;
  date: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://172.20.10.6:8000/api/latest';

  useEffect(() => {
    const fetchData = () => {
      fetch(API_BASE_URL)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch from server');
          return res.json();
        })
        .then((result) => {
          setData(result);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError('Cannot connect to Raspberry Pi server.');
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl">
        <h3 className="font-bold">Connection Error</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-500 animate-pulse">
        Connecting to Raspberry Pi and loading live data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="text-right text-xs text-slate-500">
          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold mr-2">
            ONLINE
          </span>
          {data.time} | {data.date}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Temperature</p>
          <h3 className="text-3xl font-black text-amber-500 mt-1">
            {data.temperature} <span className="text-sm font-normal text-slate-400">°C</span>
          </h3>
          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-semibold">
            Live Data
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Humidity</p>
          <h3 className="text-3xl font-black text-sky-500 mt-1">
            {data.humidity} <span className="text-sm font-normal text-slate-400">%</span>
          </h3>
          <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded font-semibold">
            Live Data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Study Score</p>
          <div className="text-3xl font-bold text-amber-500 mt-2">
            {data.studyScore} <span className="text-lg font-normal text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Sleep Score</p>
          <div className="text-3xl font-bold text-emerald-500 mt-2">
            {data.sleepScore} <span className="text-lg font-normal text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
          <p className="text-sm font-bold text-rose-600">Environment Status</p>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            {data.humidity < 40 ? <p>• Low Ambient Humidity</p> : <p>• Humidity is within range</p>}
            {data.temperature > 30 ? <p>• Temperature is warm</p> : <p>• Temperature is comfortable</p>}
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
        <h3 className="text-emerald-900 font-bold text-sm mb-2">Recommendations</h3>
        <ul className="text-xs text-emerald-800 space-y-1 list-disc pl-4">
          {data.humidity < 40 ? (
            <li>Air is dry. Please activate a humidifier.</li>
          ) : (
            <li>Humidity levels are standard.</li>
          )}
          {data.temperature > 30 ? (
            <li>Room temperature is high. Consider adjusting ventilation.</li>
          ) : (
            <li>Temperature looks comfortable.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
 