export default function HistoryPage() {
 return (
<div className="space-y-6">
<h1 className="text-2xl font-bold text-slate-800">History Analytics</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><h3 className="text-sm font-bold text-slate-700 mb-3">CO2 History (ppm)</h3><div className="h-36 bg-slate-50 rounded-lg flex items-center justify-center border text-xs text-slate-400">[ CO2 Line Graph ]</div></div>
<div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><h3 className="text-sm font-bold text-slate-700 mb-3">Temperature History (°C)</h3><div className="h-36 bg-slate-50 rounded-lg flex items-center justify-center border text-xs text-slate-400">[ Temp Line Graph ]</div></div>
</div>
</div>
 );
}