'use client';

import { useEffect, useState } from 'react';

interface DeviceStatusData {
  device: string;
  status: string;
  wifi: string;
  temperatureSensor: string;
  humiditySensor: string;
  lastDataReceived: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DeviceStatusPage() {
  const [data, setData] = useState<DeviceStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error('API URL is not configured');
        }

        const response = await fetch(
          `${API_BASE_URL}/api/device-status`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch device status');
        }

        const result: DeviceStatusData = await response.json();

        setData(result);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Cannot get device status from Raspberry Pi.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceStatus();

    const interval = setInterval(fetchDeviceStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-500 animate-pulse">
        Checking Raspberry Pi status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl">
        <h3 className="font-bold">
          Device Status Error
        </h3>

        <p className="text-sm mt-1">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-2xl">
        No device status data available.
      </div>
    );
  }

  const statusItems = [
    {
      label: 'Raspberry Pi',
      value: data.device,
      ok: data.status === 'Online',
    },
    {
      label: 'System Status',
      value: data.status,
      ok: data.status === 'Online',
    },
    {
      label: 'Wi-Fi',
      value: data.wifi,
      ok: data.wifi === 'Connected',
    },
    {
      label: 'Temperature Sensor',
      value: data.temperatureSensor,
      ok: data.temperatureSensor === 'Connected',
    },
    {
      label: 'Humidity Sensor',
      value: data.humiditySensor,
      ok: data.humiditySensor === 'Connected',
    },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Device Status
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Raspberry Pi and sensor connection status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {statusItems.map((item) => (
          <div
            key={item.label}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {item.label}
              </p>

              <span
                className={`w-3 h-3 rounded-full ${
                  item.ok
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
                }`}
              />
            </div>

            <p className="text-lg font-bold text-slate-800 mt-3">
              {item.value}
            </p>

            <span
              className={`inline-block mt-3 px-2 py-1 rounded text-xs font-semibold ${
                item.ok
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {item.ok ? 'OK' : 'Problem'}
            </span>
          </div>
        ))}

      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500">
          Last Data Received
        </p>

        <p className="font-semibold text-slate-800 mt-2">
          {data.lastDataReceived}
        </p>
      </div>

    </div>
  );
}