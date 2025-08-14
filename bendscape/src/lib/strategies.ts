import { DrawingParameters } from '@/types';

// Strategy pattern for length calculation
export interface LengthStrategy {
  calculateLength(params: DrawingParameters): number;
}

export class FixedLengthStrategy implements LengthStrategy {
  calculateLength(params: DrawingParameters): number {
    return params.fixedLength;
  }
}

export class RandomLengthStrategy implements LengthStrategy {
  calculateLength(params: DrawingParameters): number {
    return Math.random() * (params.maxLength - params.minLength) + params.minLength;
  }
}

// Strategy pattern for angle calculation
export interface AngleStrategy {
  calculateAngle(params: DrawingParameters, currentAngle: number): number;
}

export class FixedAngleStrategy implements AngleStrategy {
  calculateAngle(params: DrawingParameters, currentAngle: number): number {
    return currentAngle + params.fixedAngle;
  }
}

export class RandomAngleStrategy implements AngleStrategy {
  calculateAngle(params: DrawingParameters, currentAngle: number): number {
    const deltaAngle = Math.random() * (params.maxAngle - params.minAngle) + params.minAngle;
    return currentAngle + deltaAngle;
  }
}

// Strategy pattern for color generation
export interface ColorStrategy {
  generateColor(params: DrawingParameters, lineIndex: number): string;
}

export class FixedColorStrategy implements ColorStrategy {
  generateColor(params: DrawingParameters): string {
    return params.fixedColor;
  }
}

export class RandomColorStrategy implements ColorStrategy {
  private pastelColors = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
    '#FFB3E6', '#E6B3FF', '#B3D9FF', '#B3FFB3', '#FFCCB3'
  ];
  
  private boldColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
    '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'
  ];
  
  private monochromeColors = [
    '#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666',
    '#808080', '#999999', '#B3B3B3', '#CCCCCC', '#E6E6E6'
  ];

  generateColor(params: DrawingParameters, lineIndex: number): string {
    let palette: string[];
    
    switch (params.colorPalette) {
      case 'pastel':
        palette = this.pastelColors;
        break;
      case 'bold':
        palette = this.boldColors;
        break;
      case 'monochrome':
        palette = this.monochromeColors;
        break;
      default:
        palette = this.pastelColors;
    }
    
    return palette[Math.floor(Math.random() * palette.length)];
  }
}
