import React, { useState } from 'react';
import { Storyboard } from '../types/storyboard';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';

interface ExportModalProps {
  storyboard: Storyboard;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ storyboard, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storyboard, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${storyboard.title.toLowerCase().replace(/\s+/g, '-')}-storyboard.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const generateMarkdownScript = () => {
    let md = `# ${storyboard.title}\n\n`;
    md += `**Genre:** ${storyboard.genre} | **Aspect Ratio:** ${storyboard.aspectRatio} | **Estimated Runtime:** ${storyboard.estimatedRuntime}\n`;
    md += `**Logline:** ${storyboard.logline}\n\n`;
    md += `## Scene Breakdown & Shot List\n\n`;

    storyboard.shots.forEach((shot) => {
      md += `### SHOT #${shot.shotNumber}: ${shot.shotType.toUpperCase()} (${shot.duration}s)\n`;
      md += `- **Camera Movement:** ${shot.cameraMovement}\n`;
      md += `- **Lens & Specs:** ${shot.lensAndSpecs}\n`;
      md += `- **Lighting:** ${shot.lightingMood}\n`;
      md += `- **Visual Action:** ${shot.sceneDescription}\n`;
      if (shot.dialogue) {
        md += `- **Dialogue (${shot.dialogue.speaker}):** "${shot.dialogue.text}"\n`;
      }
      md += `- **Sound & Music:** SFX: ${shot.soundDesign} | Score: ${shot.musicCue}\n`;
      md += `- **Director's Note:** ${shot.directorNote}\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-100">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-400" />
              Export Production Assets
            </h3>
            <p className="text-xs text-zinc-400">Share or archive "{storyboard.title}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Print / PDF Option */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-amber-500/50 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-100">Printable Storyboard Sheet / PDF</div>
                <div className="text-xs text-zinc-400">High-resolution grid layout with frame illustrations and dialogue</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-400">Print</span>
          </button>

          {/* Copy Screenplay Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-sky-500/50 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-zinc-950 transition-colors">
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-100">Copy Screenplay Markdown</div>
                <div className="text-xs text-zinc-400">Formatted director shot list ready for Final Draft or Notion</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-sky-400">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download JSON Data */}
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-emerald-500/50 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-100">Download Raw Storyboard JSON</div>
                <div className="text-xs text-zinc-400">Complete structured schema with lighting, timecodes, and camera metadata</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Save JSON</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
