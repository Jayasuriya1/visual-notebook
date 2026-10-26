import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Code, AlertCircle, Maximize2, X } from 'lucide-react';

interface InteractiveMindmapProps {
  mermaidCode: string;
  title?: string;
  className?: string;
  onError?: (err: Error) => void;
}

export const InteractiveMindmap: React.FC<InteractiveMindmapProps> = ({
  mermaidCode,
  title,
  className = '',
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#FEF3C7',
        primaryTextColor: '#000000',
        primaryBorderColor: '#000000',
        lineColor: '#000000',
        secondaryColor: '#EFF6FF',
        tertiaryColor: '#F5F3FF',
        fontSize: '15px',
        fontFamily: 'Atkinson Hyperlegible, Plus Jakarta Sans, sans-serif'
      },
      securityLevel: 'loose',
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
        useMaxWidth: true
      }
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!mermaidCode || !mermaidCode.trim()) {
        setSvgContent('');
        return;
      }

      setRenderError(null);
      const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

      try {
        let cleanCode = mermaidCode.trim();
        cleanCode = cleanCode.replace(/```mermaid\n?|\n?```/g, '').trim();

        const { svg } = await mermaid.render(uniqueId, cleanCode);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.warn('Mermaid rendering issue:', err);
        const errorMsg = err?.message || 'Diagram syntax could not be rendered.';
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
  }, [mermaidCode, onError]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className={`w-full overflow-hidden my-3 ${className}`}>
      {/* Title & Controls Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#F1F5F9] border-2 border-black border-b-0 rounded-t-md text-xs font-mono text-black">
        <div className="font-bold flex items-center gap-2 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0"></span>
          <span className="truncate">{title || 'CONCEPTUAL FLOWCHART'}</span>
        </div>

        <div className="flex items-center gap-1.5 no-print shrink-0">
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-black rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
            title={showCode ? 'View Diagram' : 'View Mermaid Code'}
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">{showCode ? 'Diagram' : 'Code'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 bg-white hover:bg-slate-100 border border-black rounded transition-colors"
            title="Copy Mermaid Syntax"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 bg-white hover:bg-slate-100 border border-black rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-black font-mono text-[11px] tabular-nums px-1 font-bold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 bg-white hover:bg-slate-100 border border-black rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 bg-white hover:bg-slate-100 border border-black rounded transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-1 bg-white hover:bg-slate-100 border border-black rounded transition-colors"
            title="View Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>

      {/* Main Diagram Canvas */}
      <div className="w-full bg-white border-2 border-black border-dashed rounded-b-md p-4 md:p-6 text-center overflow-x-auto min-h-[160px] flex items-center justify-center">
        {renderError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center text-slate-800 max-w-lg">
            <AlertCircle className="w-6 h-6 text-rose-600 mb-1" />
            <p className="text-sm font-bold text-black">Diagram syntax issue</p>
            <p className="text-xs text-slate-600 mt-0.5 mb-2">{renderError}</p>
            <pre className="text-left w-full p-2 bg-slate-100 border border-black rounded text-[11px] font-mono overflow-x-auto text-black">
              {mermaidCode}
            </pre>
          </div>
        ) : showCode ? (
          <div className="w-full text-left">
            <div className="text-[11px] font-mono font-bold text-black mb-1">Mermaid Graph Source:</div>
            <pre className="p-3 bg-slate-100 border-2 border-black text-black text-xs font-mono rounded overflow-x-auto">
              {mermaidCode}
            </pre>
          </div>
        ) : svgContent ? (
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="transition-transform duration-100 ease-out flex items-center justify-center w-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 py-6">
            <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            <span>Synthesizing vector diagram...</span>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Dialog */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 sm:p-8 backdrop-blur-xs no-print">
          <div className="flex items-center justify-between pb-3 text-white font-mono text-xs border-b border-white/20">
            <div className="font-bold flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>{title || 'ENLARGED DIAGRAM VIEW'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomOut}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs"
              >
                -
              </button>
              <span className="tabular-nums font-bold px-1">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/40 rounded transition-colors ml-2 cursor-pointer"
                title="Close Fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <div
              style={{ transform: `scale(${zoom * 1.25})`, transformOrigin: 'center center' }}
              className="bg-white p-6 rounded-lg border-2 border-black max-w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
