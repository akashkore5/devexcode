'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  CommandLineIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

type Tab = 'html' | 'css' | 'js';

interface LiveCodeRunnerProps {
  title?: string;
  html?: string;
  css?: string;
  js?: string;
}

interface ConsoleLine {
  type: 'log' | 'error' | 'warn' | 'info';
  text: string;
}

/**
 * A fully client-side, sandboxed live code runner for HTML / CSS / JS.
 * Renders the combined document inside a sandboxed <iframe srcDoc> and
 * pipes console.* and runtime errors back to a console pane via postMessage.
 * No backend / network needed — perfect for frontend practice.
 */
export default function LiveCodeRunner({
  title = 'Live Sandbox',
  html = '',
  css = '',
  js = '',
}: LiveCodeRunnerProps) {
  const tabs: Tab[] = [
    ...(html !== '' || (css === '' && js === '') ? (['html'] as Tab[]) : []),
    ...(css !== '' ? (['css'] as Tab[]) : []),
    ...(js !== '' ? (['js'] as Tab[]) : []),
  ];
  // Always include all three editors so users can experiment freely.
  const allTabs: Tab[] = ['html', 'css', 'js'];

  const [htmlCode, setHtmlCode] = useState(html);
  const [cssCode, setCssCode] = useState(css);
  const [jsCode, setJsCode] = useState(js);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0] ?? 'html');
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [view, setView] = useState<'preview' | 'console'>('preview');
  const [runKey, setRunKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const initial = { html, css, js };

  const buildSrcDoc = useCallback(() => {
    const consoleShim = `
      <script>
        (function () {
          var send = function (type, args) {
            try {
              parent.postMessage({ __runner: true, type: type, text: Array.prototype.map.call(args, function (a) {
                try {
                  if (typeof a === 'object') return JSON.stringify(a, null, 2);
                  return String(a);
                } catch (e) { return String(a); }
              }).join(' ') }, '*');
            } catch (e) {}
          };
          ['log', 'info', 'warn', 'error'].forEach(function (m) {
            var orig = console[m];
            console[m] = function () { send(m === 'log' ? 'log' : m, arguments); orig && orig.apply(console, arguments); };
          });
          window.addEventListener('error', function (e) {
            send('error', [e.message + (e.lineno ? ' (line ' + e.lineno + ')' : '')]);
          });
          window.addEventListener('unhandledrejection', function (e) {
            send('error', ['Unhandled promise rejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason)]);
          });
        })();
      <\/script>`;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>${cssCode}</style>${consoleShim}</head><body>${htmlCode}<script>try{${jsCode}\n}catch(e){console.error(e.message);}<\/script></body></html>`;
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data && e.data.__runner) {
        setConsoleLines((prev) => [...prev, { type: e.data.type, text: e.data.text }]);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const run = () => {
    setConsoleLines([]);
    setRunKey((k) => k + 1);
    // If JS is present, surface the console automatically.
    if (jsCode.trim() && !htmlCode.trim()) setView('console');
  };

  const reset = () => {
    setHtmlCode(initial.html);
    setCssCode(initial.css);
    setJsCode(initial.js);
    setConsoleLines([]);
    setRunKey((k) => k + 1);
  };

  // Run once on mount.
  useEffect(() => {
    setRunKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const codeFor = (t: Tab) => (t === 'html' ? htmlCode : t === 'css' ? cssCode : jsCode);
  const setCodeFor = (t: Tab, v: string) =>
    t === 'html' ? setHtmlCode(v) : t === 'css' ? setCssCode(v) : setJsCode(v);

  const tabIcon = (t: Tab) =>
    t === 'js' ? <CommandLineIcon className="w-3.5 h-3.5" /> : <CodeBracketIcon className="w-3.5 h-3.5" />;

  const consoleColor = (type: ConsoleLine['type']) =>
    type === 'error'
      ? 'text-red-400'
      : type === 'warn'
        ? 'text-amber-400'
        : type === 'info'
          ? 'text-sky-400'
          : 'text-slate-300';

  return (
    <div className="my-10 rounded-[28px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 transition-all"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={run}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <PlayIcon className="w-3.5 h-3.5" />
            Run
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Editor side */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 flex flex-col">
          <div className="flex items-center gap-1 px-3 pt-3 bg-slate-50 dark:bg-slate-900/20">
            {allTabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === t
                    ? 'bg-white dark:bg-slate-950/60 text-indigo-600 dark:text-indigo-400 border-t border-x border-slate-200 dark:border-white/10'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tabIcon(t)}
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={codeFor(activeTab)}
            onChange={(e) => setCodeFor(activeTab, e.target.value)}
            spellCheck={false}
            className="w-full h-[260px] sm:h-[320px] p-4 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 font-mono text-[12.5px] leading-relaxed outline-none resize-none"
            placeholder={`Write ${activeTab.toUpperCase()} here…`}
          />
        </div>

        {/* Output side */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 px-3 pt-3 bg-slate-50 dark:bg-slate-900/20">
            <button
              onClick={() => setView('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                view === 'preview'
                  ? 'bg-white dark:bg-slate-950/60 text-indigo-600 dark:text-indigo-400 border-t border-x border-slate-200 dark:border-white/10'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <EyeIcon className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setView('console')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                view === 'console'
                  ? 'bg-white dark:bg-slate-950/60 text-indigo-600 dark:text-indigo-400 border-t border-x border-slate-200 dark:border-white/10'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <CommandLineIcon className="w-3.5 h-3.5" />
              Console{consoleLines.length > 0 ? ` (${consoleLines.length})` : ''}
            </button>
          </div>

          <div className="relative h-[260px] sm:h-[320px] bg-white dark:bg-slate-950/60">
            <div className={view === 'preview' ? 'block h-full' : 'hidden'}>
              <iframe
                key={runKey}
                ref={iframeRef}
                title={title}
                sandbox="allow-scripts allow-modals allow-forms allow-popups"
                srcDoc={buildSrcDoc()}
                className="w-full h-full bg-white"
              />
            </div>
            <div
              className={`${view === 'console' ? 'block' : 'hidden'} h-full overflow-auto p-4 font-mono text-[12px] leading-relaxed bg-slate-950`}
            >
              {consoleLines.length === 0 ? (
                <span className="text-slate-600">// console output appears here — press Run</span>
              ) : (
                consoleLines.map((line, i) => (
                  <div key={i} className={`whitespace-pre-wrap ${consoleColor(line.type)}`}>
                    <span className="text-slate-600 select-none mr-2">›</span>
                    {line.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
