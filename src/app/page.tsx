'use client';

import { useEffect, useState } from 'react';

interface LatestData {
  temperature: number;
  humidity: number;
  moldRisk: string;
  heatstrokeRisk: string;
  dryAirRisk: string;
  studyScore: number;
  sleepScore: number;
  alertLevel: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<LatestData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.0.47:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/latest`);

        if (!res.ok) {
          throw new Error('Failed to fetch from backend');
        }

        const result = await res.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Cannot connect to Raspberry Pi server.');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  if (error) {
    return (
      <div className="glass-card rounded-[28px] p-6 text-rose-700">
        <h3 className="font-bold text-lg">Connection Error</h3>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card rounded-[28px] p-6 text-slate-600">
        Loading live room data...
      </div>
    );
  }

  const alertMessages: string[] = [];

  if (data.moldRisk === 'High') {
    alertMessages.push('Mold Risk Warning');
  }

  if (data.heatstrokeRisk === 'High') {
    alertMessages.push('Heatstroke Risk Warning');
  }

  if (data.dryAirRisk === 'High') {
    alertMessages.push('Dry Air Warning');
  }

  if (data.alertLevel === 'High' && alertMessages.length === 0) {
    alertMessages.push('Environment Alert');
  }

  const recommendations: string[] = [];

  if (data.humidity >= 70) {
    recommendations.push('Humidity is high. Ventilate the room.');
  }

  if (data.humidity < 40) {
    recommendations.push('Air is dry. Use a humidifier if possible.');
  }

  if (data.temperature >= 28) {
    recommendations.push('Room temperature is warm. Improve airflow.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Room environment is stable.');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle mt-1">
            Live room environment overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="glass-chip px-3 py-2 rounded-full text-xs font-semibold text-emerald-700">
            ONLINE
          </span>
          <span className="text-sm text-slate-500">{data.createdAt}</span>
        </div>
      </div>

      {/* Main 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card-strong rounded-[28px] p-6">
          <p className="metric-label">Temperature</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <h3 className="metric-value text-amber-500">
                {data.temperature}
                <span className="text-xl font-normal text-slate-400"> °C</span>
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {data.temperature >= 28 ? 'Warm condition' : 'Comfortable condition'}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card-strong rounded-[28px] p-6">
          <p className="metric-label">Humidity</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <h3 className="metric-value text-sky-500">
                {data.humidity}
                <span className="text-xl font-normal text-slate-400"> %</span>
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {data.humidity >= 70
                  ? 'High humidity'
                  : data.humidity < 40
                  ? 'Dry air'
                  : 'Balanced humidity'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-[26px] p-6">
          <p className="metric-label">Mold Risk</p>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            {data.moldRisk}
          </h3>
        </div>

        <div className="glass-card rounded-[26px] p-6">
          <p className="metric-label">Heatstroke Risk</p>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            {data.heatstrokeRisk}
          </h3>
        </div>

        <div className="glass-card rounded-[26px] p-6">
          <p className="metric-label">Dry Air Risk</p>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            {data.dryAirRisk}
          </h3>
        </div>
      </div>

      {/* Scores + alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-[26px] p-6">
          <p className="metric-label">Study Score</p>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-amber-500">
            {data.studyScore}
            <span className="text-xl font-normal text-slate-400"> / 100</span>
          </h3>
        </div>

        <div className="glass-card rounded-[26px] p-6">
          <p className="metric-label">Sleep Score</p>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-emerald-500">
            {data.sleepScore}
            <span className="text-xl font-normal text-slate-400"> / 100</span>
          </h3>
        </div>

        <div className="glass-card rounded-[26px] p-6">
          <p className="metric-label">Alert Level</p>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            {data.alertLevel}
          </h3>
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-card rounded-[28px] p-6">
        <h2 className="small-title">Alerts</h2>

        <div className="mt-4">
          {alertMessages.length === 0 ? (
            <p className="text-slate-600">No active alerts.</p>
          ) : (
            <ul className="space-y-2 text-rose-600">
              {alertMessages.map((msg, index) => (
                <li key={index}>• {msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card rounded-[28px] p-6 border border-emerald-200/60">
        <h2 className="small-title text-emerald-900">Recommendations</h2>

        <ul className="mt-4 space-y-2 text-emerald-800">
          {recommendations.map((msg, index) => (
            <li key={index}>• {msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}