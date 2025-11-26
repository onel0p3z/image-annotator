import { Annotation, ToolType, Point } from '../types';

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  width: number
) => {
  const headLength = width * 4; 
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();

  // Draw Arrow Head
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(to.x, to.y);
  ctx.fillStyle = color;
  ctx.fill();
};

export const drawPixelate = (
  ctx: CanvasRenderingContext2D,
  originalImage: HTMLImageElement | HTMLCanvasElement,
  start: Point,
  end: Point,
  blockSize: number = 10
) => {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(start.x - end.x);
  const h = Math.abs(start.y - end.y);

  if (w < 1 || h < 1) return;

  // We need to draw the original image chunk, but pixelated
  // Since we don't have direct access to underlying pixels easily in this stateless draw function without performance hit,
  // we simulate pixelation by drawing small rectangles of the averaged color (simplified) 
  // OR simpler: use the drawImage with low dimensions then scale up.
  
  // Save context
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  
  // Turn off smoothing to get pixelated look
  ctx.imageSmoothingEnabled = false;
  
  // Draw small
  const scaledW = w * 0.1;
  const scaledH = h * 0.1;
  ctx.drawImage(originalImage, x, y, w, h, x, y, scaledW, scaledH);
  
  // Draw back large
  ctx.drawImage(originalImage, x, y, scaledW, scaledH, x, y, w, h);
  
  ctx.restore();
};

export const renderAnnotation = (
  ctx: CanvasRenderingContext2D,
  annotation: Annotation,
  originalImage?: HTMLImageElement | null
) => {
  const { type, points, color, strokeWidth } = annotation;
  if (points.length < 1) return;

  const start = points[0];
  const end = points[points.length - 1];

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (type) {
    case ToolType.PEN:
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      break;

    case ToolType.ARROW:
      drawArrow(ctx, start, end, color, strokeWidth);
      break;

    case ToolType.RECTANGLE:
      ctx.beginPath();
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
      ctx.stroke();
      break;

    case ToolType.CIRCLE:
      ctx.beginPath();
      const radiusX = Math.abs(end.x - start.x) / 2;
      const radiusY = Math.abs(end.y - start.y) / 2;
      const centerX = (start.x + end.x) / 2;
      const centerY = (start.y + end.y) / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
      break;

    case ToolType.TEXT:
      if (annotation.text) {
        ctx.font = `bold ${strokeWidth * 6}px sans-serif`;
        ctx.textBaseline = 'top';
        ctx.fillText(annotation.text, start.x, start.y);
      }
      break;

    case ToolType.NUMBER:
        // Draw a circle with a number inside
        const numRadius = strokeWidth * 4;
        ctx.beginPath();
        ctx.arc(start.x, start.y, numRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#fff'; // Text always white
        ctx.font = `bold ${strokeWidth * 4}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(annotation.text || "1", start.x, start.y);
        break;

    case ToolType.PIXELATE:
      if (originalImage) {
        drawPixelate(ctx, originalImage, start, end);
      } else {
        // Fallback if image not provided (visual indicator)
        ctx.fillStyle = 'rgba(100,100,100,0.5)';
        ctx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
      }
      break;
  }
};