/**
 * True Vector A4 Print & PDF Pipeline (No Raster Screenshots / Canvas Hacks)
 * Uses native browser vector printing engines to ensure crisp, 100% selectable,
 * searchable vector PDF exports.
 */

export function printTextbookVector(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.warn('Native window.print() was blocked or failed, using popout print window fallback:', err);
    return false;
  }
}

/**
 * Opens a pristine, un-sandboxed vector print window.
 * This guarantees vector printing works even when running inside embedded iframes (e.g. AI Studio preview).
 */
export function openVectorPrintWindow(elementId: string, documentTitle: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle} - Vector A4 Print</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Lexend:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm 12mm 10mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Atkinson Hyperlegible', sans-serif;
      background: #ffffff;
      color: #111827;
      line-height: 1.6;
      max-width: 880px;
      margin: 0 auto;
      padding: 16px;
      font-size: 11pt;
    }

    .no-print {
      display: none !important;
    }

    /* Print toolbar for convenient 1-tap print in new window */
    .print-control-bar {
      position: sticky;
      top: 0;
      background: #f8fafc;
      border: 2px solid #000;
      padding: 12px 16px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 6px;
      z-index: 9999;
    }

    .print-btn {
      background: #000;
      color: #fff;
      font-weight: 800;
      font-size: 13px;
      padding: 8px 18px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-transform: uppercase;
      font-family: monospace;
    }

    .print-btn:hover {
      background: #333;
    }

    /* Vector Callout Boxes */
    .callout-core {
      background-color: #eff6ff !important;
      border: 2px solid #000000 !important;
      border-left: 6px solid #1d4ed8 !important;
      color: #1e3a8a !important;
      padding: 16px !important;
      margin: 12px 0 !important;
      border-radius: 4px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .callout-model {
      background-color: #f5f3ff !important;
      border: 2px solid #000000 !important;
      border-left: 6px solid #6d28d9 !important;
      color: #4c1d95 !important;
      padding: 16px !important;
      margin: 12px 0 !important;
      border-radius: 4px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .callout-trap {
      background-color: #fef2f2 !important;
      border: 2px solid #000000 !important;
      border-left: 6px solid #dc2626 !important;
      color: #7f1d1d !important;
      padding: 16px !important;
      margin: 12px 0 !important;
      border-radius: 4px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .callout-action {
      background-color: #ecfdf5 !important;
      border: 2px solid #000000 !important;
      border-left: 6px solid #059669 !important;
      color: #064e3b !important;
      padding: 16px !important;
      margin: 12px 0 !important;
      border-radius: 4px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .summary-box {
      background-color: #fef3c7 !important;
      border: 2px solid #000 !important;
      padding: 16px !important;
      border-radius: 4px;
    }

    .chapter-banner {
      background-color: #f1f5f9 !important;
      border-top: 2px solid #000 !important;
      border-bottom: 2px solid #000 !important;
      padding: 10px 14px !important;
      margin: 20px 0 !important;
    }

    /* Comparison Tables */
    .textbook-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #000000;
      margin: 16px 0;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .textbook-table th {
      background-color: #e2e8f0 !important;
      color: #000000 !important;
      font-weight: 800;
      border: 1px solid #000000;
      border-bottom: 2px solid #000000;
      padding: 8px 12px;
      text-align: left;
    }

    .textbook-table td {
      border: 1px solid #000000;
      padding: 8px 12px;
      text-align: left;
      vertical-align: top;
    }

    /* Avoid page splits */
    .print-avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 14pt;
    }

    .print-chapter {
      page-break-inside: auto !important;
      break-inside: auto !important;
      margin-bottom: 24pt;
    }

    svg {
      max-width: 100% !important;
      height: auto !important;
    }

    @media print {
      .print-control-bar {
        display: none !important;
      }
      body {
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="print-control-bar no-print">
    <div style="font-family: monospace; font-size: 13px; font-weight: bold;">
      📄 Vector Print View Ready · 100% Crisp Vector Text
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">
        🖨️ Print / Save Vector PDF (Ctrl+P)
      </button>
      <button class="print-btn" onclick="window.close()" style="background: #fff; color: #000; border: 2px solid #000;">
        Close
      </button>
    </div>
  </div>

  ${element.outerHTML}

  <script>
    // Prompt print automatically once window styles are ready
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

/**
 * Downloads a standalone, offline-ready vector HTML file.
 */
export function downloadVectorHtml(elementId: string, filename: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Lexend:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 12mm 10mm 12mm 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Atkinson Hyperlegible', sans-serif; background: #fff; color: #111827; line-height: 1.6; max-width: 880px; margin: 0 auto; padding: 20px; font-size: 11pt; }
    .no-print { display: none !important; }
    .callout-core { background-color: #eff6ff !important; border: 2px solid #000 !important; border-left: 6px solid #1d4ed8 !important; color: #1e3a8a !important; padding: 16px; margin: 12px 0; break-inside: avoid; }
    .callout-model { background-color: #f5f3ff !important; border: 2px solid #000 !important; border-left: 6px solid #6d28d9 !important; color: #4c1d95 !important; padding: 16px; margin: 12px 0; break-inside: avoid; }
    .callout-trap { background-color: #fef2f2 !important; border: 2px solid #000 !important; border-left: 6px solid #dc2626 !important; color: #7f1d1d !important; padding: 16px; margin: 12px 0; break-inside: avoid; }
    .callout-action { background-color: #ecfdf5 !important; border: 2px solid #000 !important; border-left: 6px solid #059669 !important; color: #064e3b !important; padding: 16px; margin: 12px 0; break-inside: avoid; }
    .textbook-table { width: 100%; border-collapse: collapse; border: 2px solid #000; margin: 16px 0; break-inside: avoid; }
    .textbook-table th { background: #e2e8f0; font-weight: 800; border: 1px solid #000; padding: 8px 12px; text-align: left; }
    .textbook-table td { border: 1px solid #000; padding: 8px 12px; text-align: left; }
    @media print { body { padding: 0; max-width: 100%; } }
  </style>
</head>
<body>
  ${element.outerHTML}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
