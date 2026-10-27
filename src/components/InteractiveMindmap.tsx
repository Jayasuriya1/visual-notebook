import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Code, AlertCircle, Maximize2, X, FileText } from 'lucide-react';

interface InteractiveMindmapProps {
  mermaidCode: string;
  title?: string;
  className?: string;
  textFallback?: string;
  onError?: (err: Error) => void;
}

/**
 * Extracts a readable textual outline from Mermaid graph syntax as an accessible fallback
 */
function extractTextOutlineFromMermaid(code: string): string[] {
  const lines = code.split('\n');
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('graph') || trimmed.startsWith('flowchart') || trimmed.startsWith('%%')) {
      continue;
    }

    // Match node connection patterns: A["Label 1"] --> B["Label 2"]
    const connectionMatch = trimmed.match(/\["?(.*?)"?\]\s*(?:-->|---|==>)\s*(?:\|.*?\|\s*)?\["?(.*?)"?\]/);
    if (connectionMatch) {
      items.push(`${connectionMatch[1]} → ${connectionMatch[2]}`);
      continue;
    }

    // Match single node definition
    const nodeMatch = trimmed.match(/\w+\["?(.*?)"?\]/);
    if (nodeMatch) {
      items.push(`• ${nodeMatch[1]}`);
    }
  }

  return items;
}

export const InteractiveMindmap: React.FC<InteractiveMindmapProps> = ({
  mermaidCode,
  title,
  className = '',
  textFallback,
  onError
}) => {
  const instanceId = useId().replace(/[:]/g, '');
  const [svgContent, setSvgContent] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [showTextOutline, setShowTextOutline] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    // Configure Mermaid with strict securityLevel
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#FEF3C7',
        primaryTextColor: '#111827',
        primaryBorderColor: '#000000',
        lineColor: '#1F2937',
        secondaryColor: '#EFF6FF',
        tertiaryColor: '#F5F3FF',
        fontSize: '14px',
        fontFamily: 'Atkinson Hyperlegible, Plus Jakarta Sans, sans-serif'
      },
      securityLevel: 'strict',
      flowchart: {
        curve: 'basis',
        htmlLabels: false, // Disallow arbitrary HTML injection
        useMaxWidth: true
      }
    });
  }, []);

  // Listen for Escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      if (!mermaidCode || !mermaidCode.trim()) {
        setSvgContent('');
        return;
      }

      setRenderError(null);
      const uniqueId = `mermaid-${instanceId}-${Math.random().toString(36).substring(2, 7)}`;

      try {
        let cleanCode = mermaidCode.trim();
        cleanCode = cleanCode.replace(/```mermaid\n?|\n?```/g, '').trim();

        // Enforce maximum size validation to prevent UI freeze
        if (cleanCode.length > 5000) {
          throw new Error('Diagram exceeds safe complexity limit.');
        }

        if (!cleanCode.startsWith('graph') && !cleanCode.startsWith('flowchart')) {
          cleanCode = 'graph TD\n' + cleanCode;
        }

        const { svg } = await mermaid.render(uniqueId, cleanCode);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.warn('[Mermaid] Safe render fallback:', err?.message);
        const errorMsg = err?.message || 'Diagram could not be rendered.';
        if (isMounted) {
          setRenderError(errorMsg);
          if (onError) onError(err);
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [mermaidCode, instanceId, onError]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoom(1);

  const textOutlineItems = extractTextOutlineFromMermaid(mermaidCode);

  return (
    <div className={`w-full overflow-hidden my-3 border border-slate-300 rounded-md bg-white shadow-xs ${className}`}>
      {/* Title & Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-mono text-slate-800 gap-2">
        <div className="font-bold flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
          <span className="truncate">{title || 'CONCEPTUAL MAP'}</span>
        </div>

        <div className="flex items-center gap-1.5 no-print shrink-0 flex-wrap">
          {/* Textual Outline Toggle (Accessibility Alternative) */}
          <button
            type="button"
            onClick={() => setShowTextOutline(!showTextOutline)}
            className={`px-2 py-1 border rounded text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              showTextOutline ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold' : 'bg-white border-slate-300 hover:bg-slate-100'
            }`}
            title={showTextOutline ? 'Hide Text Outline' : 'View Text Alternative'}
            aria-label="Toggle text alternative for diagram"
          >
            <FileText className="w-3 h-3" />
            <span className="hidden sm:inline">Text Outline</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className={`px-2 py-1 border rounded text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              showCode ? 'bg-slate-200 border-slate-400 font-bold' : 'bg-white border-slate-300 hover:bg-slate-100'
            }`}
            title={showCode ? 'View Diagram' : 'View Mermaid Code'}
            aria-label="Toggle Mermaid source code"
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">{showCode ? 'Diagram' : 'Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors cursor-pointer"
            title="Copy Diagram Syntax"
            aria-label="Copy diagram syntax"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center border border-slate-300 rounded bg-white">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-800 font-mono text-[11px] tabular-nums px-1.5 font-bold border-x border-slate-200">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors cursor-pointer"
            title="Reset Zoom"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors cursor-pointer"
            title="View Fullscreen"
            aria-label="View diagram fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-800" />
          </button>
        </div>
      </div>

      {/* Main Diagram Canvas or Accessible Alternatives */}
      <div className="w-full bg-[#FCFBF8] p-4 md:p-6 text-center overflow-x-auto min-h-[140px] flex items-center justify-center">
        {showTextOutline ? (
          <div className="w-full text-left bg-white p-4 border border-slate-200 rounded text-xs space-y-2">
            <div className="font-bold font-mono text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Accessible Diagram Text Outline</span>
            </div>
            {textFallback && (
              <p className="text-slate-700 leading-relaxed font-sans">{textFallback}</p>
            )}
            {textOutlineItems.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 font-mono text-slate-800">
                {textOutlineItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No structured relational lines found.</p>
            )}
          </div>
        ) : showCode ? (
          <div className="w-full text-left">
            <div className="text-[11px] font-mono font-bold text-slate-800 mb-1">Mermaid Graph Source:</div>
            <pre className="p-3 bg-slate-900 text-slate-100 text-xs font-mono rounded overflow-x-auto">
              {mermaidCode}
            </pre>
          </div>
        ) : renderError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center text-slate-800 max-w-lg">
            <AlertCircle className="w-5 h-5 text-amber-700 mb-1" />
            <p className="text-xs font-bold text-slate-900">Diagram Visual Unavailable</p>
            <p className="text-[11px] text-slate-600 mt-0.5 mb-2">Showing structured text relationships instead:</p>
            <div className="text-left w-full p-3 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800 space-y-1">
              {textOutlineItems.length > 0 ? (
                textOutlineItems.map((item, idx) => <div key={idx}>{item}</div>)
              ) : (
                <div className="italic text-slate-500">{textFallback || 'Conceptual outline not available.'}</div>
              )}
            </div>
          </div>
        ) : svgContent ? (
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="transition-transform duration-100 ease-out flex items-center justify-center w-full max-w-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            role="img"
            aria-label={title || 'Conceptual Diagram'}
          />
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 py-6">
            <span className="w-3 h-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
            <span>Rendering diagram...</span>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Dialog */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex flex-col p-4 sm:p-8 backdrop-blur-xs no-print"
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Enlarged Diagram'}
        >
          <div className="flex items-center justify-between pb-3 text-white font-mono text-xs border-b border-white/20">
            <div className="font-bold flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>{title || 'ENLARGED DIAGRAM VIEW'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomOut}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs cursor-pointer"
                aria-label="Zoom out"
              >
                -
              </button>
              <span className="tabular-nums font-bold px-1">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs cursor-pointer"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/40 rounded transition-colors ml-2 cursor-pointer"
                title="Close Fullscreen (Esc)"
                aria-label="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <div
              style={{ transform: `scale(${zoom * 1.25})`, transformOrigin: 'center center' }}
              className="bg-white p-6 rounded-lg border border-slate-300 max-w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
