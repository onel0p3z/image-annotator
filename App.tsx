import React, { useState, useEffect, useCallback, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import Toolbar from './components/Toolbar';
import { ToolType, AppState, Annotation } from './types';
import { analyzeAnnotation } from './services/geminiService';
import { Upload, X, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const [state, setState] = useState<AppState>({
    currentTool: ToolType.ARROW,
    currentColor: '#ef4444', // Default Red
    strokeWidth: 4,
    history: [],
    historyStep: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- History Management ---
  const pushHistory = (newHistory: Annotation[]) => {
    setState(prev => ({
      ...prev,
      history: newHistory,
      historyStep: newHistory.length
    }));
  };

  const undo = () => {
    if (state.historyStep > 0) {
      setState(prev => ({ ...prev, historyStep: prev.historyStep - 1 }));
    }
  };

  const redo = () => {
    if (state.historyStep < state.history.length) {
      setState(prev => ({ ...prev, historyStep: prev.historyStep + 1 }));
    }
  };

  const currentHistory = state.history.slice(0, state.historyStep);

  // --- IO Handlers ---

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImageSrc(event.target?.result as string);
            // Reset history on new image
            setState(prev => ({ ...prev, history: [], historyStep: 0 }));
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setState(prev => ({ ...prev, history: [], historyStep: 0 }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // --- Actions ---

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    
    try {
      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve));
      if (!blob) return;
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      // Visual feedback could be added here (toast)
      alert("Annotated image copied to clipboard! Paste it into your AI Agent.");
    } catch (err) {
      console.error("Failed to copy", err);
      alert("Failed to copy to clipboard. Please check permissions.");
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `annotated-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleAnalyze = async () => {
    if (!canvasRef.current) return;
    if (!process.env.API_KEY) {
        alert("Please configure process.env.API_KEY to use AI features.");
        return;
    }
    
    setIsLoading(true);
    setShowAiModal(true);
    setAiResponse(null);

    try {
      const base64 = canvasRef.current.toDataURL();
      const text = await analyzeAnnotation(base64, "Describe the highlighted areas in this screenshot. If it contains code, suggest improvements or find bugs.");
      setAiResponse(text || "No response generated.");
    } catch (e) {
      setAiResponse("Error analyzing image. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col relative bg-ide-bg text-ide-text">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*"
      />

      <CanvasBoard 
        imageSrc={imageSrc}
        tool={state.currentTool}
        color={state.currentColor}
        strokeWidth={state.strokeWidth}
        history={currentHistory}
        onHistoryChange={pushHistory}
        getCanvasRef={(ref) => canvasRef.current = ref}
      />

      <Toolbar 
        currentTool={state.currentTool}
        setTool={(t) => setState(prev => ({ ...prev, currentTool: t }))}
        currentColor={state.currentColor}
        setColor={(c) => setState(prev => ({ ...prev, currentColor: c }))}
        strokeWidth={state.strokeWidth}
        setStrokeWidth={(w) => setState(prev => ({ ...prev, strokeWidth: w }))}
        onUndo={undo}
        onRedo={redo}
        canUndo={state.historyStep > 0}
        canRedo={state.historyStep < state.history.length}
        onClear={() => setState(prev => ({ ...prev, history: [], historyStep: 0 }))}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onAnalyze={handleAnalyze}
        onUpload={() => fileInputRef.current?.click()}
      />

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-ide-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 Gemini Analysis
              </h3>
              <button onClick={() => setShowAiModal(false)} className="hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 size={40} className="animate-spin text-ide-accent" />
                  <p className="text-ide-text">Analyzing image context...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {aiResponse}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-ide-border flex justify-end">
               <button 
                onClick={() => {
                    navigator.clipboard.writeText(aiResponse || "");
                    setShowAiModal(false);
                }}
                className="bg-ide-accent hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
               >
                 Copy Text & Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;