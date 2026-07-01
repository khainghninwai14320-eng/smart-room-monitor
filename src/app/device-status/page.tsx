'use client';

import { useEffect, useState } from 'react';

interface DeviceStatus {

  label: string;

  val: string;

  ok: boolean;

}

export default function DeviceStatusPage() {

  const [statuses, setStatuses] = useState<DeviceStatus[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  // Replace this URL with your backend teammate's actual IP address

  const BACKEND_STATUS_URL = 'http://192.168.1.100:8000/api/device-status';

  useEffect(() => {

    fetch(BACKEND_STATUS_URL)

      .then((res) => res.json())

      .then((data) => {

        setStatuses(data);

        setLoading(false);

      })

      .catch((err) => {

        console.error(err);

        setLoading(false);

      });

  }, [BACKEND_STATUS_URL]);

  if (loading) {

    return <div className="text-sm text-slate-500 animate-pulse">Checking hardware diagnostic status...</div>;

  }

  return (
<div className="space-y-6 max-w-2xl">
<h1 className="text-2xl font-bold text-slate-800">Device System Status</h1>
<div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y">

        {statuses.length === 0 ? (
<div className="p-4 text-center text-slate-400 text-sm">No diagnostic data retrieved from Raspberry Pi.</div>

        ) : (

          statuses.map((s, i) => (
<div key={i} className="p-4 flex justify-between items-center">
<span className="text-sm font-medium text-slate-600">| {s.label}</span>
<div className="flex items-center gap-2">
<span className="text-sm text-slate-800 font-semibold">{s.val}</span>

                {s.ok && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
</div>
</div>

          ))

        )}
</div>
</div>

  );

}
 
