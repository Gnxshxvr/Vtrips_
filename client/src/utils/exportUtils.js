export const downloadPDF = (elementId, filename) => {
  // The 'html2pdf' canvas injection completely locks the main thread
  // on complex, glass-morphism heavy UIs causing complete application hangs.
  // Native window.print() combined with a print stylesheet is bulletproof.
  window.print();
};

export const downloadJSON = (data, filename) => {
  if (!data) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'VTRIP_Plan.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
