'use client';

import { useEffect, useState } from 'react';

interface LatestData {
  alertLevel: string;
  alerts: string[];
  createdAt: string;
}

interface SettingsData {
  refresh_interval: number;
  alert_enabled: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://192.168.0.47:8000';

export default function AlertsPage() {
  const [data, setData] =
    useState<LatestData | null>(null);

  const [alertEnabled, setAlertEnabled] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertResponse, settingsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/api/latest`),
            fetch(`${API_BASE_URL}/api/settings`),
          ]);

        if (
          !alertResponse.ok ||
          !settingsResponse.ok
        ) {
          throw new Error();
        }

        const alertData: LatestData =
          await alertResponse.json();

        const settingsData: SettingsData =
          await settingsResponse.json();

        setData(alertData);

        setAlertEnabled(
          settingsData.alert_enabled
        );

        setError(null);
      } catch (err) {
        console.error(err);

        setError(
          'Raspberry Piからアラートデータを取得できません。'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval =
      setInterval(fetchData, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        アラートデータを読み込んでいます...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl">
        <h3 className="font-bold">
          アラート取得エラー
        </h3>

        <p className="text-sm mt-1">
          {error}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const translateStatus = (
    status: string
  ) => {
    switch (status) {
      case 'High':
        return '高';
      case 'Medium':
        return '中';
      case 'Low':
        return '低';
      case 'Normal':
        return '正常';
      default:
        return status;
    }
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          アラート
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          現在の室内環境に関する警告を確認できます
        </p>
      </div>

      <div className="glass-card p-5 rounded-2xl">
        <p className="text-sm text-slate-500">
          現在の警告レベル
        </p>

        <div className="mt-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
              data.alertLevel === 'High'
                ? 'bg-rose-100 text-rose-700'
                : data.alertLevel === 'Medium'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {translateStatus(
              data.alertLevel
            )}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-3">
          最終更新: {data.createdAt}
        </p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">
            現在のアラート
          </h2>
        </div>

        {!alertEnabled ? (
          <div className="p-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-700">
                アラート表示はオフです
              </p>

              <p className="text-sm text-slate-500 mt-1">
                設定画面からオンに変更できます。
              </p>
            </div>
          </div>
        ) : data.alerts.length === 0 ? (
          <div className="p-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="font-semibold text-emerald-700">
                アラートはありません
              </p>

              <p className="text-sm text-emerald-600 mt-1">
                現在の室内環境は正常です。
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.alerts.map(
              (alert, index) => (
                <div
                  key={index}
                  className="p-5 flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {translateAlert(alert)}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {data.createdAt}
                    </p>
                  </div>

                  <span className="px-2 py-1 rounded text-xs font-bold bg-rose-100 text-rose-700">
                    {translateStatus(
                      data.alertLevel
                    )}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}