'use client';

import { useEffect, useState } from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface HistoryData {
  id?: number;
  temperature: number;
  humidity: number;
  studyScore: number;
  sleepScore: number;
  createdAt: string;
}

type FilterType = '20' | '1h' | '24h';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://192.168.0.47:8000';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] =
    useState<FilterType>('20');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/history`
        );

        if (!response.ok) {
          throw new Error(
            '履歴データの取得に失敗しました。'
          );
        }

        const result: HistoryData[] =
          await response.json();

        setHistory(result);
        setError(null);
      } catch (err) {
        console.error(err);

        setError(
          'Raspberry Piから履歴データを取得できません。'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        履歴データを読み込んでいます...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl">
        <h3 className="font-bold">
          履歴データ取得エラー
        </h3>

        <p className="text-sm mt-1">
          {error}
        </p>
      </div>
    );
  }

  // =========================
  // Filter
  // =========================

  const now = new Date();

  const filteredHistory = history.filter(
    (item, index) => {
      // 最新20件
      if (filter === '20') {
        return index < 20;
      }

      const itemDate = new Date(
        item.createdAt.replace(' ', 'T')
      );

      const difference =
        now.getTime() - itemDate.getTime();

      // 1時間
      if (filter === '1h') {
        return (
          difference >= 0 &&
          difference <= 60 * 60 * 1000
        );
      }

      // 24時間
      if (filter === '24h') {
        return (
          difference >= 0 &&
          difference <= 24 * 60 * 60 * 1000
        );
      }

      return true;
    }
  );

  // APIは新しい順なので、
  // グラフでは古い → 新しい順にする
  const chartData = [...filteredHistory]
    .reverse()
    .map((item) => ({
      time: item.createdAt.slice(11, 16),

      temperature: item.temperature,
      humidity: item.humidity,

      studyScore: item.studyScore,
      sleepScore: item.sleepScore,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          履歴
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          過去の室内環境データを確認できます
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('20')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filter === '20'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/70 text-slate-600 border border-white shadow-sm hover:bg-white'
          }`}
        >
          直近20件
        </button>

        <button
          onClick={() => setFilter('1h')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filter === '1h'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/70 text-slate-600 border border-white shadow-sm hover:bg-white'
          }`}
        >
          1時間
        </button>

        <button
          onClick={() => setFilter('24h')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filter === '24h'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/70 text-slate-600 border border-white shadow-sm hover:bg-white'
          }`}
        >
          24時間
        </button>
      </div>

      {/* Temperature / Humidity Graph */}
      <div className="glass-card rounded-[28px] p-6">
        <div className="mb-6">
          <h2 className="font-bold text-slate-800">
            温度・湿度の推移
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            最近の室内環境の変化
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-slate-500">
            選択した期間のデータがありません。
          </div>
        ) : (
          <div className="w-full h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.3}
                />

                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                />

                {/* 温度 */}
                <YAxis
                  yAxisId="temperature"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  unit="℃"
                  width={45}
                />

                {/* 湿度 */}
                <YAxis
                  yAxisId="humidity"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  unit="%"
                  width={45}
                />

                <Tooltip />

                <Legend />

                <Line
                  yAxisId="temperature"
                  type="monotone"
                  dataKey="temperature"
                  name="温度"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  name="湿度"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Study / Sleep Score Graph */}
      <div className="glass-card rounded-[28px] p-6">
        <div className="mb-6">
          <h2 className="font-bold text-slate-800">
            学習・睡眠環境スコアの推移
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            最近のスコア変化
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            選択した期間のデータがありません。
          </div>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.3}
                />

                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="studyScore"
                  name="学習環境スコア"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="sleepScore"
                  name="睡眠環境スコア"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-slate-500">
            温度
          </p>

          <p className="text-xl font-bold text-amber-500 mt-2">
            温度履歴
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-slate-500">
            湿度
          </p>

          <p className="text-xl font-bold text-sky-500 mt-2">
            湿度履歴
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-slate-500">
            学習環境スコア
          </p>

          <p className="text-xl font-bold text-amber-500 mt-2">
            スコア履歴
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-slate-500">
            睡眠環境スコア
          </p>

          <p className="text-xl font-bold text-emerald-500 mt-2">
            スコア履歴
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">
            センサー履歴
          </h2>

          <span className="text-xs text-slate-400">
            {filteredHistory.length} 件
          </span>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            選択した期間の履歴データがありません。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/40 text-slate-600">
                <tr>
                  <th className="p-3 text-left">
                    日時
                  </th>

                  <th className="p-3 text-left">
                    温度
                  </th>

                  <th className="p-3 text-left">
                    湿度
                  </th>

                  <th className="p-3 text-left">
                    学習環境スコア
                  </th>

                  <th className="p-3 text-left">
                    睡眠環境スコア
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map(
                  (item, index) => (
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
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}