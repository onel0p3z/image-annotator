import React, { useState, useEffect, useCallback, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import Toolbar from './components/Toolbar';
import { ToolType, AppState, Annotation } from './types';
import { analyzeAnnotation, initializeGemini } from './services/geminiService';
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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [prompt, setPrompt] = useState("Describe the highlighted areas in this screenshot. If it contains code, suggest improvements or find bugs.");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // VS Code API
  const vscode = useRef<any>(null);
  
  // Safe initialization of VS Code API
  if (!vscode.current && typeof acquireVsCodeApi === 'function') {
      try {
        vscode.current = acquireVsCodeApi();
      } catch(e) {
        console.error("Failed to acquire VS Code API:", e);
      }
  }

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
      
      setToastMessage("Annotated image copied to clipboard!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds

    } catch (err) {
      console.error("Failed to copy", err);
      setToastMessage("Failed to copy to clipboard. Please check permissions.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `annotated-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'setApiKey') {
        initializeGemini(message.key);
        setApiKey(message.key);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleAnalyze = () => {
    if (!canvasRef.current) return;
    setShowAiModal(true);
    setAiResponse(null);
    setErrorDetails(null);
  };

  const runAnalysis = async () => {
    if (!canvasRef.current) return;
    
    setIsLoading(true);
    setAiResponse(null);
    setErrorDetails(null);

    try {
      const base64 = canvasRef.current.toDataURL();
      const text = await analyzeAnnotation(base64, prompt);
      setAiResponse(text || "No response generated.");
    } catch (e: any) {
      const errorMsg = e.message || JSON.stringify(e);
      setAiResponse("Error analyzing image. Click copy to get details.");
      setErrorDetails(`Error analyzing image:\n${errorMsg}\n\nStack:\n${e.stack}`);
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
        imageSrc={imageSrc}
      />

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-ide-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 {apiKey ? 'Gemini Analysis' : 'Setup Required'}
              </h3>
              <button onClick={() => setShowAiModal(false)} className="hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {!apiKey ? (
                 <div className="flex flex-col gap-4 text-ide-text">
                    <p className="text-red-400 font-semibold">Gemini API Key is missing.</p>
                    <p>To use the AI features, you need to configure your API key in VS Code settings.</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li>Get a key from <a href="https://aistudio.google.com/app/apikey" className="text-blue-400 underline">Google AI Studio</a></li>
                        <li>Click the button below to open settings</li>
                        <li>Paste your key into the <strong>Antigravity Annotator: Gemini Api Key</strong> field</li>
                    </ol>
                    <div className="mt-4">
                        <button 
                            onClick={() => vscode.current?.postMessage({ command: 'openSettings' })}
                            className="bg-ide-accent hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                            Open VS Code Settings
                        </button>
                    </div>
                 </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 size={40} className="animate-spin text-ide-accent" />
                  <p className="text-ide-text">Analyzing image context...</p>
                </div>
              ) : aiResponse ? (
                <div className="prose prose-invert max-w-none">
                   {errorDetails && (
                       <div className="bg-red-900/20 border border-red-500/50 p-3 rounded mb-4 text-red-200 text-sm">
                           Analysis failed. You can copy the technical details below to debug.
                       </div>
                   )}
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {aiResponse}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col gap-4 h-full">
                    <p className="text-ide-text text-sm">Review and edit the prompt before sending to Gemini:</p>
                    <textarea 
                        className="w-full flex-1 bg-ide-bg border border-ide-border rounded p-3 text-white focus:border-ide-accent outline-none resize-none"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-ide-border flex justify-end gap-3">
               {/* Cancel Button: Show if not loading and (no response or error present) */}
               {!isLoading && (!aiResponse || errorDetails) && (
                   <button 
                    onClick={() => setShowAiModal(false)}
                    className="text-ide-text hover:text-white px-4 py-2 rounded text-sm"
                   >
                     Cancel
                   </button>
               )}
               
               {/* Analyze Button: Show if has key, not loading, and no response yet */}
               {apiKey && !isLoading && !aiResponse && (
                   <button 
                    onClick={runAnalysis}
                    className="bg-ide-accent hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                   >
                     Analyze
                   </button>
               )}

               {/* Copy Button: Show if response exists (success or error) */}
               {aiResponse && (
                   <button 
                    onClick={() => {
                        navigator.clipboard.writeText(errorDetails || aiResponse || "");
                        if (errorDetails) {
                             setToastMessage("Error details copied to clipboard.");
                             setShowToast(true);
                             setTimeout(() => setShowToast(false), 3000);
                        } else {
                             setShowAiModal(false);
                        }
                    }}
                    className={`px-4 py-2 rounded text-sm font-medium text-white ${errorDetails ? 'bg-red-600 hover:bg-red-700' : 'bg-ide-accent hover:bg-blue-600'}`}
                   >
                     {errorDetails ? "Copy Error Details" : "Copy Text & Close"}
                   </button>
               )}
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[101]">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default App;