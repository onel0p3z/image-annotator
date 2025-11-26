export enum ToolType {
  SELECT = 'SELECT',
  PEN = 'PEN',
  ARROW = 'ARROW',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  TEXT = 'TEXT',
  PIXELATE = 'PIXELATE',
  NUMBER = 'NUMBER'
}

export interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  id: string;
  type: ToolType;
  points: Point[];
  color: string;
  strokeWidth: number;
  text?: string;
  filled?: boolean;
}

export interface AppState {
  currentTool: ToolType;
  currentColor: string;
  strokeWidth: number;
  history: Annotation[];
  historyStep: number; // For undo/redo
}

export const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#ffffff', // White
  '#000000', // Black
];