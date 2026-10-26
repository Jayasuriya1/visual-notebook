import React, { useState } from 'react';
import { DiagnosticLog } from '../types';
import { Bug, X, Copy, Check, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface ErrorConsoleProps {
  logs: DiagnosticLog[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const ErrorConsole: React.FC<ErrorConsoleProps> = ({
  logs,
  isOpen,
  onClose,
  onClear
}) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warn'>('all');
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const errorCount = logs.filter((l) => l.level === 'error').length;
  const filtered = logs.filter((l) => (filter === 'all' ? true : l.level === filter));

  const handleCopy = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.step}]: ${l.message} ${l.details ? `\nDetails: ${l.details}` : ''}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#FFFDF9] border-t-4 border-black shadow-2xl p-4 md:p-6 max-h-[420px] flex flex-col font-mono text-xs text-black diagnostic-drawer no-print">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-black shrink-0">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-black" />
          <span className="font-extrabold text-sm uppercase">Diagnostic & Pipeline Console</span>
          {errorCount > 0 && (
            <span className="bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
              {errorCount} ERRORS
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-black rounded overflow-hidden text-[11px] font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 ${filter === 'all' ? 'bg-black text-white' : 'bg-white hover:bg-slate-100'}`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2 py-0.5 border-l border-black ${filter === 'error' ? 'bg-rose-600 text-white' : 'bg-white hover:bg-slate-100'}`}
            >
              Errors ({errorCount})
            </button>
            <button
              onClick={() => setFilter('warn')}
              className={`px-2 py-0.5 border-l border-black ${filter === 'warn' ? 'bg-amber-500 text-black' : 'bg-white hover:bg-slate-100'}`}
            >
              Warnings ({logs.filter((l) => l.level === 'warn').length})
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 border border-black rounded bg-white hover:bg-slate-100"
            title="Copy logs to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onClear}
            className="p-1.5 border border-black rounded bg-white hover:bg-slate-100"
            title="Clear console"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 border border-black rounded bg-black text-white hover:bg-slate-800"
            title="Close console"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto pt-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            No events logged. Operations will be tracked here in real-time.
          </div>
        ) : (
          filtered.map((log) => {
            const isExpanded = expandedId === log.id;
            return (
              <div
                key={log.id}
                className={`p-2.5 rounded border-2 transition-colors ${
                  log.level === 'error'
                    ? 'bg-rose-50 border-rose-600 text-rose-950'
                    : log.level === 'warn'
                    ? 'bg-amber-50 border-amber-600 text-amber-950'
                    : log.level === 'success'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                    : 'bg-white border-black text-black'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {log.level === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : log.level === 'warn' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : log.level === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <span>{log.timestamp}</span>
                        <span>·</span>
                        <span className="font-bold uppercase tracking-wider">{log.step}</span>
                      </div>
                      <div className="font-sans font-semibold text-xs mt-0.5">{log.message}</div>
                    </div>
                  </div>

                  {log.details && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className="p-1 hover:bg-black/10 rounded"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {log.details && isExpanded && (
                  <pre className="mt-2 pt-2 border-t border-black/20 text-[11px] font-mono break-all whitespace-pre-wrap text-slate-800 bg-white/70 p-2 rounded">
                    {log.details}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
