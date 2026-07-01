export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">About Project</h1>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          <strong>Smart Room Monitor</strong> is an integrated IoT solution that leverages a Raspberry Pi 3 Model B+
          and precise ambient environment sensors to monitor air quality, thermal levels, and relative humidity.
        </p>
        <p>
          The system analyzes carbon dioxide levels, ambient temperature, and humidity values in real-time
          to calculate accurate metrics for optimized studying and sleeping conditions.
        </p>
        <p className="text-xs pt-4 border-t text-slate-400">
          Version: 1.0.0 <br />
          Developed by: us in 2026
        </p>
      </div>
    </div>
  );
}