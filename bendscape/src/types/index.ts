// Core types for the Bendscape application
export interface Point {
  x: number;
  y: number;
}

export interface LineSegment {
  start: Point;
  end: Point;
  length: number;
  angle: number; // in degrees
  color: string;
}

export interface DrawingParameters {
  // Length settings
  lengthMode: 'fixed' | 'random';
  fixedLength: number;
  minLength: number;
  maxLength: number;
  
  // Angle settings
  angleMode: 'fixed' | 'random';
  fixedAngle: number;
  minAngle: number;
  maxAngle: number;
  
  // Color settings
  colorMode: 'fixed' | 'random' | 'gradient';
  fixedColor: string;
  colorPalette: 'pastel' | 'bold' | 'monochrome';
  
  // Stopping conditions
  stoppingCondition: 'distance' | 'count' | 'exact';
  minDistance: number;
  maxLines: number;
  
  // Canvas settings
  startPoint: Point;
  canvasWidth: number;
  canvasHeight: number;
}

export interface DrawingState {
  segments: LineSegment[];
  currentPoint: Point;
  currentAngle: number;
  isComplete: boolean;
  totalLines: number;
}

export interface PresetData {
  name: string;
  parameters: DrawingParameters;
  timestamp: number;
}
