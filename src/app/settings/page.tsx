'use client';

import { useEffect, useState } from 'react';

interface SettingsData {
  refresh_interval: number;
  alert_enabled: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://192.168.0.47:8000';

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/settings`
        );

        if (!response.ok) {
          throw new Error();
        }

        const data: SettingsData =
          await response.json();

        setSettings(data);
        setError('');
      } catch (err) {
        console.error(err);

        setError(
          'Raspberry Piから設定を取得できません。'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const response = await fetch(
        `${API_BASE_URL}/api/settings`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const result = await response.json();

      setSettings(result.settings);

      setMessage(
        '設定を保存しました。'
      );
    } catch (err) {
      console.error(err);

      setError(
        '設定を保存できませんでした。'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        設定を読み込んでいます...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl">
        設定データを取得できません。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          設定
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Smart Room Monitor の動作設定
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Refresh Interval */}
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-slate-500">
            ダッシュボード更新間隔
          </p>

          <div className="flex items-center gap-3 mt-3">
            <input
              type="number"
              min={1}
              max={60}
              value={settings.refresh_interval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  refresh_interval:
                    Number(e.target.value),
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xl font-bold outline-none focus:ring-2 focus:ring-sky-200"
            />

            <span className="text-slate-500 whitespace-nowrap">
              秒
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            1〜60秒の間で設定できます。
          </p>
        </div>

        {/* Alert */}
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-sm text-slate-500">
            アラート表示
          </p>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="font-bold text-slate-800">
                {settings.alert_enabled
                  ? 'オン'
                  : 'オフ'}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                室内環境の警告メッセージを表示します
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  alert_enabled:
                    !settings.alert_enabled,
                })
              }
              className={`relative w-14 h-8 rounded-full transition ${
                settings.alert_enabled
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                  settings.alert_enabled
                    ? 'left-7'
                    : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 transition disabled:opacity-50"
        >
          {saving
            ? '保存中...'
            : '設定を保存'}
        </button>
      </div>
    </div>
  );
}