import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Annotation, Point, ToolType } from '../types';
import { renderAnnotation } from '../utils/drawUtils';
import { v4 as uuidv4 } from 'uuid'; // Actually we will use simple random string to avoid adding dep if possible, but let's implement simple ID

const generateId = () => Math.random().toString(36).substr(2, 9);

interface CanvasBoardProps {
  imageSrc: string | null;
  tool: ToolType;
  color: string;
  strokeWidth: number;
  history: Annotation[];
  onHistoryChange: (newHistory: Annotation[]) => void;
  getCanvasRef: (ref: HTMLCanvasElement | null) => void;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  imageSrc, tool, color, strokeWidth, history, onHistoryChange, getCanvasRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(new Image());
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [textInput, setTextInput] = useState<{ x: number, y: number, text: string } | null>(null);

  // Load Image
  useEffect(() => {
    if (imageSrc) {
      bgImageRef.current.src = imageSrc;
      bgImageRef.current.onload = () => {
        // Fit to window or use native size, constrained by container
        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 40;
        
        let w = bgImageRef.current.naturalWidth;
        let h = bgImageRef.current.naturalHeight;

        // Scale down if too big
        const scale = Math.min(maxWidth / w, maxHeight / h, 1);
        
        setCanvasSize({ w: w * scale, h: h * scale });
      };
    }
  }, [imageSrc]);

  // Expose Ref
  useEffect(() => {
    getCanvasRef(canvasRef.current);
  }, [getCanvasRef]);

  // Main Render Loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Image
    if (imageSrc) {
       // We disable smoothing for pixelate tool effectiveness on base layer, but enable generally
       ctx.imageSmoothingEnabled = true;
       ctx.drawImage(bgImageRef.current, 0, 0, canvas.width, canvas.height);
    }

    // Draw History
    history.forEach(ann => renderAnnotation(ctx, ann, bgImageRef.current));

    // Draw Current Action (Ghost)
    if (isDrawing && currentPoints.length > 0) {
      const ghostAnnotation: Annotation = {
        id: 'ghost',
        type: tool,
        points: currentPoints,
        color: color,
        strokeWidth: strokeWidth,
        text: tool === ToolType.NUMBER ? (history.filter(h => h.type === ToolType.NUMBER).length + 1).toString() : undefined
      };
      renderAnnotation(ctx, ghostAnnotation, bgImageRef.current);
    }
  }, [imageSrc, history, isDrawing, currentPoints, tool, color, strokeWidth]);

  useEffect(() => {
    draw();
  }, [draw, canvasSize]);

  // --- Mouse Handlers ---

  const getPoint = (e: React.MouseEvent | MouseEvent): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === ToolType.SELECT) return;
    
    const startPoint = getPoint(e);

    if (tool === ToolType.TEXT) {
      setTextInput({ x: startPoint.x, y: startPoint.y, text: '' });
      return;
    }

    if (tool === ToolType.NUMBER) {
       // Instant placement for number
       const count = history.filter(h => h.type === ToolType.NUMBER).length + 1;
       const newAnn: Annotation = {
        id: generateId(),
        type: ToolType.NUMBER,
        points: [startPoint],
        color: color,
        strokeWidth: strokeWidth,
        text: count.toString()
       };
       onHistoryChange([...history, newAnn]);
       return;
    }

    setIsDrawing(true);
    setCurrentPoints([startPoint]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const point = getPoint(e);

    if (tool === ToolType.PEN) {
      setCurrentPoints(prev => [...prev, point]);
    } else {
      // For shapes/arrows, we just update the end point
      setCurrentPoints(prev => [prev[0], point]);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length < 2 && tool !== ToolType.PEN) {
        // Too small movement, ignore unless pen
        setCurrentPoints([]);
        return;
    }

    const newAnnotation: Annotation = {
      id: generateId(),
      type: tool,
      points: currentPoints,
      color: color,
      strokeWidth: strokeWidth
    };

    onHistoryChange([...history, newAnnotation]);
    setCurrentPoints([]);
  };

  // Text Input Handler
  const finishText = () => {
    if (!textInput || !textInput.text.trim()) {
      setTextInput(null);
      return;
    }
    const newAnnotation: Annotation = {
      id: generateId(),
      type: ToolType.TEXT,
      points: [{ x: textInput.x, y: textInput.y }],
      color: color,
      strokeWidth: strokeWidth, // used for font size calculation
      text: textInput.text
    };
    onHistoryChange([...history, newAnnotation]);
    setTextInput(null);
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-full h-full bg-ide-bg overflow-auto p-4">
      {imageSrc ? (
        <div className="relative shadow-2xl border border-ide-border">
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => isDrawing && setIsDrawing(false)}
            className="cursor-crosshair block"
          />
          {textInput && (
            <input
              autoFocus
              value={textInput.text}
              onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
              onBlur={finishText}
              onKeyDown={(e) => e.key === 'Enter' && finishText()}
              style={{
                position: 'absolute',
                left: textInput.x,
                top: textInput.y,
                color: color,
                fontSize: `${strokeWidth * 6}px`,
                fontWeight: 'bold',
                background: 'rgba(30,30,30,0.8)',
                border: '1px solid #007fd4',
                outline: 'none',
                minWidth: '50px'
              }}
            />
          )}
        </div>
      ) : (
        <div className="text-center text-ide-text opacity-50">
           <p className="mb-4 text-xl">Paste an image (Ctrl+V) or Drop here</p>
           <p className="text-sm">Or use the upload button</p>
        </div>
      )}
    </div>
  );
};

export default CanvasBoard;