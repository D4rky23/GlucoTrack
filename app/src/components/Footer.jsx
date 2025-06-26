import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const healthTips = [
  'Drink water instead of sugary drinks today.',
  'Take a brisk 10-minute walk after lunch.',
  'Eat a serving of vegetables with every meal.',
  'Get 7-8 hours of sleep tonight.',
  'Practice mindful breathing for 2 minutes.',
  'Swap white bread for whole grain.',
  'Stand up and stretch every hour.',
  'Limit screen time before bed.',
  'Choose fruit for dessert.',
  'Check your blood sugar if you have diabetes.',
  'Try a new healthy recipe this week.',
  'Take the stairs instead of the elevator.',
  'Plan your meals for the day.',
  'Do 5 minutes of stretching after waking up.',
  'Eat slowly and mindfully.',
  'Replace soda with sparkling water.',
  'Go for a walk after dinner.',
  'Pack a healthy snack for work.',
  'Practice gratitude for your health.',
  'Call a friend and share a laugh.',
  'Spend 10 minutes outside in nature.',
  'Try a new fruit or vegetable today.',
  'Do a quick desk workout.',
  'Set a reminder to drink water every hour.',
  'Take a break and breathe deeply.',
  'Limit processed foods today.',
  'Write down one thing you’re proud of.',
  'Listen to your favorite music and move!',
  'Check your posture right now.',
  'Smile at yourself in the mirror.'
];

function getRandomTipIndex() {
  return Math.floor(Math.random() * healthTips.length);
}

function getPersonalizedTip() {
  const hour = new Date().getHours();
  if (hour < 10) return 'Start your day with a healthy breakfast!';
  if (hour < 14) return 'Take a brisk 10-minute walk after lunch.';
  if (hour < 18) return 'Remember to drink water this afternoon.';
  if (hour < 22) return 'Wind down with some mindful breathing.';
  return 'Get enough sleep for a healthy tomorrow!';
}

export default function Footer({
  openLegalModal = () => alert('Privacy & Terms modal!'),
}) {
  // Pick a random tip every render
  const todayIndex = getRandomTipIndex();
  // Use build-time injected version
  const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '';
  const [modelVersion, setModelVersion] = useState('');
  const [apiOnline, setApiOnline] = useState(true);
  const [healthTip, setHealthTip] = useState(healthTips[todayIndex]);

  useEffect(() => {
    // Fetch model version
    fetch('/api/v1/model/info')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setModelVersion(data.version || data.model_version || ''))
      .catch(() => setModelVersion(''));

    // Fetch API health
    fetch('/api/v1/health')
      .then(res => setApiOnline(res.ok))
      .catch(() => setApiOnline(false));

    // Personalize health tip
    setHealthTip(getPersonalizedTip() || healthTips[todayIndex]);
  }, [todayIndex]);

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-300 dark:border-slate-700 py-6 px-4 mt-auto w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left: Logo & copyright */}
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="font-semibold text-base text-slate-700 dark:text-slate-200">GlucoTrack</span>
          <span className="text-xs text-slate-400 ml-2">© {new Date().getFullYear()}</span>
        </div>
        {/* Center: Daily Health Tip */}
        <div className="text-center md:text-center">
          <div className="font-semibold mb-1">💡 Daily Health Tip</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-1">{healthTip}</div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 max-w-xs mx-auto italic">Tip of the Day: {healthTips[todayIndex]}</div>
        </div>
        {/* Right: Status, feedback, socials, legal */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="flex items-center gap-2 text-xs mb-1">
            <span className={apiOnline ? 'text-green-600' : 'text-red-500'}>{apiOnline ? '✅ API Online' : '❌ API Offline'}</span>
            <span>• App v{appVersion || '—'}</span>
            <span>• Model v{modelVersion || '—'}</span>
          </div>
          <div className="flex gap-2 text-xs mb-1">
            <NavLink to="/feedback" className="hover:underline">🐞 Bug</NavLink>
            <NavLink to="/suggestion" className="hover:underline">💡 Sugestii</NavLink>
          </div>
          <div className="flex gap-3 mt-1 mb-1">
            <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-emerald-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.1.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z"/></svg>
            </a>
            <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-emerald-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0112 7.07c.85.004 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.58.69.48A10.01 10.01 0 0022 12.26C22 6.58 17.52 2 12 2z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-emerald-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
            </a>
          </div>
          <button
            onClick={openLegalModal}
            className="mt-1 px-3 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-medium transition-all"
            aria-label="Privacy & Terms"
          >
            ⚖️ Privacy & Terms
          </button>
        </div>
      </div>
    </footer>
  );
}
