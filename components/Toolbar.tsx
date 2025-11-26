import React from 'react';
import { 
  MousePointer2, Pencil, MoveUpRight, Square, Circle, Type, 
  Grid3X3, Hash, Undo2, Redo2, Copy, Download, Sparkles, Trash2,
  ImagePlus
} from 'lucide-react';
import { ToolType, COLORS } from '../types';

interface ToolbarProps {
  currentTool: ToolType;
  setTool: (t: ToolType) => void;
  currentColor: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onAnalyze: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUpload: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool, setTool,
  currentColor, setColor,
  strokeWidth, setStrokeWidth,
  onUndo, onRedo, onClear,
  onCopy, onDownload, onAnalyze,
  canUndo, canRedo, onUpload
}) => {
  
  const tools = [
    { type: ToolType.SELECT, icon: <MousePointer2 size={18} />, label: "Select" },
    { type: ToolType.PEN, icon: <Pencil size={18} />, label: "Pen" },
    { type: ToolType.ARROW, icon: <MoveUpRight size={18} />, label: "Arrow" },
    { type: ToolType.RECTANGLE, icon: <Square size={18} />, label: "Rectangle" },
    { type: ToolType.CIRCLE, icon: <Circle size={18} />, label: "Circle" },
    { type: ToolType.TEXT, icon: <Type size={18} />, label: "Text" },
    { type: ToolType.PIXELATE, icon: <Grid3X3 size={18} />, label: "Blur" },
    { type: ToolType.NUMBER, icon: <Hash size={18} />, label: "Count" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-ide-panel border border-ide-border rounded-lg shadow-2xl p-2 flex flex-col gap-2 z-50">
      
      {/* Top Row: Tools */}
      <div className="flex items-center gap-1 border-b border-ide-border pb-2 mb-1">
        <button 
          onClick={onUpload}
          className="p-2 rounded hover:bg-ide-hover text-ide-text hover:text-white transition-colors tooltip-trigger"
          title="Upload New Image"
        >
          <ImagePlus size={18} />
        </button>
        <div className="w-px h-6 bg-ide-border mx-1"></div>
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setTool(tool.type)}
            className={`p-2 rounded transition-colors ${
              currentTool === tool.type 
                ? 'bg-ide-accent text-white' 
                : 'text-ide-text hover:bg-ide-hover hover:text-white'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Middle Row: Colors & Size */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex gap-1">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border border-ide-border transition-transform hover:scale-110 ${currentColor === c ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <input 
          type="range" 
          min="2" 
          max="20" 
          value={strokeWidth} 
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-24 accent-ide-accent"
          title="Stroke Width"
        />
      </div>

      {/* Bottom Row: Actions */}
      <div className="flex items-center justify-between border-t border-ide-border pt-2 mt-1">
        <div className="flex gap-1">
           <button onClick={onUndo} disabled={!canUndo} className="p-2 rounded hover:bg-ide-hover disabled:opacity-30 text-ide-text">
            <Undo2 size={18} />
           </button>
           <button onClick={onRedo} disabled={!canRedo} className="p-2 rounded hover:bg-ide-hover disabled:opacity-30 text-ide-text">
            <Redo2 size={18} />
           </button>
           <button onClick={onClear} className="p-2 rounded hover:bg-red-900/50 text-red-400 hover:text-red-200">
            <Trash2 size={18} />
           </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onAnalyze}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs transition-colors"
          >
            <Sparkles size={14} /> Ask AI
          </button>
          <button 
            onClick={onCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-ide-accent hover:bg-blue-600 text-white font-medium text-xs transition-colors"
          >
            <Copy size={14} /> Copy
          </button>
          <button 
            onClick={onDownload}
            className="p-2 rounded hover:bg-ide-hover text-ide-text"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;