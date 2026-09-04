export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Smart Room monitoring settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Temperature Warning
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            28 °C
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Low Humidity Warning
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            40 %
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            High Humidity Warning
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            70 %
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Dashboard Refresh Interval
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            5 seconds
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h2 className="font-bold text-amber-800">
          Settings Update
        </h2>

        <p className="text-sm text-amber-700 mt-2">
          These values currently show the backend monitoring rules.
          Editing settings will be enabled after the settings API is implemented.
        </p>
      </div>
    </div>
  );
}