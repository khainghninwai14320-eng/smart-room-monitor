export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">
        プロジェクトについて
      </h1>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          <strong>Smart Room Monitor</strong> は、
          Raspberry Pi 3 Model B+ と環境センサーを使用して、
          室内の温度・湿度をリアルタイムで監視するIoTシステムです。
        </p>

        <p>
          取得した温度・湿度データをもとに、
          カビリスク、熱中症リスク、乾燥リスクを判定し、
          学習環境スコアや睡眠環境スコアを表示します。
        </p>

        <p>
          また、室内環境に問題がある場合はアラートを表示し、
          快適な環境を保つための対策を提案します。
        </p>

        <p className="text-xs pt-4 border-t text-slate-400">
          バージョン: 1.0.0
          <br />
          開発年: 2026年
        </p>
      </div>
    </div>
  );
}