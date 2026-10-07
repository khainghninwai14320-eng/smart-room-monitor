'use client';

import { useEffect, useState } from 'react';

import {
  Thermometer,
  Droplets,
  Waves,
  SunMedium,
  Wind,
  BookOpen,
  Moon,
  TriangleAlert,
  Bell,
  Lightbulb,
} from 'lucide-react';

interface LatestData {
  temperature: number;
  humidity: number;
  moldRisk: string;
  heatstrokeRisk: string;
  dryAirRisk: string;
  studyScore: number;
  sleepScore: number;
  alertLevel: string;
  alerts: string[];
  recommendations: string[];
  createdAt: string;
}

interface SettingsData {
  refresh_interval: number;
  alert_enabled: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://192.168.0.47:8000';

export default function DashboardPage() {
  const [data, setData] =
    useState<LatestData | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshInterval, setRefreshInterval] =
    useState(5);

  const [alertEnabled, setAlertEnabled] =
    useState(true);

  // Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/settings`
        );

        if (!response.ok) {
          throw new Error();
        }

        const settings: SettingsData =
          await response.json();

        setRefreshInterval(
          Math.max(
            1,
            Number(settings.refresh_interval) || 5
          )
        );

        setAlertEnabled(
          settings.alert_enabled
        );
      } catch (err) {
        console.error(
          'Settings Error:',
          err
        );
      }
    };

    fetchSettings();
  }, []);

  // Sensor Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/latest`
        );

        if (!res.ok) {
          throw new Error();
        }

        const result: LatestData =
          await res.json();

        setData(result);
        setError(null);
      } catch (err) {
        console.error(err);

        setError(
          'Raspberry Pi サーバーに接続できません。'
        );
      }
    };

    fetchData();

    const interval = setInterval(
      fetchData,
      refreshInterval * 1000
    );

    return () =>
      clearInterval(interval);
  }, [refreshInterval]);

  if (error) {
    return (
      <div className="glass-card rounded-[28px] p-6 text-rose-700">
        <h3 className="font-bold text-lg">
          接続エラー
        </h3>

        <p className="mt-2 text-sm">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card rounded-[28px] p-6 text-slate-600">
        室内環境データを読み込んでいます...
      </div>
    );
  }

  // Status → Japanese
  const translateStatus = (
    status: string
  ) => {
    switch (status) {
      case 'Low':
        return '低';

      case 'Medium':
        return '中';

      case 'High':
        return '高';

      case 'Normal':
        return '正常';

      default:
        return status;
    }
  };

  // Status Color
  const getRiskColor = (
    status: string
  ) => {
    switch (status) {
      case 'High':
        return 'text-rose-600';

      case 'Medium':
        return 'text-amber-500';

      case 'Low':
        return 'text-emerald-600';

      case 'Normal':
        return 'text-emerald-600';

      default:
        return 'text-slate-900';
    }
  };

  // Alert Translation
  const translateAlert = (
    alert: string
  ) => {
    switch (alert) {
      case 'Temperature High':
        return '室温が高くなっています。';

      case 'Dry Air Warning':
        return '室内が乾燥しています。';

      case 'Mold Risk Warning':
        return 'カビ発生リスクが高くなっています。';

      default:
        return alert;
    }
  };

  // Recommendation Translation
  const translateRecommendation = (
    item: string
  ) => {
    switch (item) {
      case 'Room temperature is high. Please cool the room.':
        return '室温が高いため、エアコンや扇風機を使用して室温を調整してください。';

      case 'Humidity is low. Use a humidifier if possible.':
        return '空気が乾燥しています。必要に応じて加湿器を使用してください。';

      case 'Humidity is high. Ventilate the room.':
        return '湿度が高いため、窓を開けるなど部屋の換気をしてください。';

      case 'The room condition is comfortable.':
        return '現在の室内環境は快適で安定しています。';

      default:
        return item;
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">

        <div>
          <h1 className="page-title">
            ダッシュボード
          </h1>

          <p className="page-subtitle mt-1">
            室内環境のリアルタイム状況
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <span className="glass-chip px-3 py-2 rounded-full text-xs font-semibold text-emerald-700">
            オンライン
          </span>

          <span className="text-sm text-slate-500">
            {data.createdAt}
          </span>

        </div>

      </div>

      {/* Temperature / Humidity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Temperature */}
        <div className="glass-card-strong rounded-[28px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Thermometer
                className="w-5 h-5 text-amber-500"
              />
            </div>

            <p className="metric-label">
              温度
            </p>

          </div>

          <h3 className="metric-value text-amber-500 mt-4">
            {data.temperature}

            <span className="text-xl font-normal text-slate-400">
              {' '}°C
            </span>
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {data.temperature >= 28
              ? '室温がやや高い状態です'
              : '快適な室温です'}
          </p>

        </div>

        {/* Humidity */}
        <div className="glass-card-strong rounded-[28px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <Droplets
                className="w-5 h-5 text-sky-500"
              />
            </div>

            <p className="metric-label">
              湿度
            </p>

          </div>

          <h3 className="metric-value text-sky-500 mt-4">
            {data.humidity}

            <span className="text-xl font-normal text-slate-400">
              {' '}%
            </span>
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {data.humidity >= 70
              ? '湿度が高い状態です'
              : data.humidity < 40
                ? '空気が乾燥しています'
                : '適切な湿度です'}
          </p>

        </div>

      </div>

      {/* Risk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Mold Risk */}
        <div className="glass-card rounded-[26px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Waves
                className="w-5 h-5 text-emerald-600"
              />
            </div>

            <p className="metric-label">
              カビリスク
            </p>

          </div>

          <h3
            className={`mt-4 text-4xl font-bold ${getRiskColor(
              data.moldRisk
            )}`}
          >
            {translateStatus(
              data.moldRisk
            )}
          </h3>

        </div>

        {/* Heatstroke Risk */}
        <div className="glass-card rounded-[26px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <SunMedium
                className="w-5 h-5 text-rose-500"
              />
            </div>

            <p className="metric-label">
              熱中症リスク
            </p>

          </div>

          <h3
            className={`mt-4 text-4xl font-bold ${getRiskColor(
              data.heatstrokeRisk
            )}`}
          >
            {translateStatus(
              data.heatstrokeRisk
            )}
          </h3>

        </div>

        {/* Dry Air Risk */}
        <div className="glass-card rounded-[26px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <Wind
                className="w-5 h-5 text-sky-500"
              />
            </div>

            <p className="metric-label">
              乾燥リスク
            </p>

          </div>

          <h3
            className={`mt-4 text-4xl font-bold ${getRiskColor(
              data.dryAirRisk
            )}`}
          >
            {translateStatus(
              data.dryAirRisk
            )}
          </h3>

        </div>

      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Study */}
        <div className="glass-card rounded-[26px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <BookOpen
                className="w-5 h-5 text-amber-500"
              />
            </div>

            <p className="metric-label">
              学習環境スコア
            </p>

          </div>

          <h3 className="mt-4 text-4xl font-bold text-amber-500">
            {data.studyScore}

            <span className="text-xl font-normal text-slate-400">
              {' '}/ 100
            </span>
          </h3>

        </div>

        {/* Sleep */}
        <div className="glass-card rounded-[26px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Moon
                className="w-5 h-5 text-emerald-500"
              />
            </div>

            <p className="metric-label">
              睡眠環境スコア
            </p>

          </div>

          <h3 className="mt-4 text-4xl font-bold text-emerald-500">
            {data.sleepScore}

            <span className="text-xl font-normal text-slate-400">
              {' '}/ 100
            </span>
          </h3>

        </div>

        {/* Alert Level */}
        <div className="glass-card rounded-[26px] p-6">

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <TriangleAlert
                className="w-5 h-5 text-rose-500"
              />
            </div>

            <p className="metric-label">
              警告レベル
            </p>

          </div>

          <h3
            className={`mt-4 text-4xl font-bold ${getRiskColor(
              data.alertLevel
            )}`}
          >
            {translateStatus(
              data.alertLevel
            )}
          </h3>

        </div>

      </div>

      {/* Alerts */}
      <div className="glass-card rounded-[28px] p-6">

        <div className="flex items-center gap-2">

          <Bell
            className="w-5 h-5 text-rose-500"
          />

          <h2 className="small-title">
            アラート
          </h2>

        </div>

        <div className="mt-4">

          {!alertEnabled ? (

            <p className="text-slate-500">
              アラート表示は設定でオフになっています。
            </p>

          ) : data.alerts.length === 0 ? (

            <p className="text-slate-600">
              現在、アラートはありません。
            </p>

          ) : (

            <ul className="space-y-2 text-rose-600">

              {data.alerts.map(
                (alert, index) => (

                  <li key={index}>
                    • {translateAlert(alert)}
                  </li>

                )
              )}

            </ul>

          )}

        </div>

      </div>

      {/* Recommendations */}
      <div className="glass-card rounded-[28px] p-6 border border-emerald-200/60">

        <div className="flex items-center gap-2">

          <Lightbulb
            className="w-5 h-5 text-emerald-600"
          />

          <h2 className="small-title text-emerald-900">
            おすすめ対策
          </h2>

        </div>

        <ul className="mt-4 space-y-2 text-emerald-800">

          {data.recommendations.map(
            (item, index) => (

              <li key={index}>
                • {translateRecommendation(
                  item
                )}
              </li>

            )
          )}

        </ul>

      </div>

    </div>
  );
}