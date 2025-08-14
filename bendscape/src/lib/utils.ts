import { DrawingState, LineSegment, PresetData, DrawingParameters } from '@/types';

export class ExportUtils {
  static exportToSVG(state: DrawingState, params: DrawingParameters, withAnnotations = false): string {
    const { canvasWidth, canvasHeight } = params;
    let svg = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add background
    svg += `<rect width="100%" height="100%" fill="white"/>`;
    
    // Add line segments
    state.segments.forEach((segment, index) => {
      svg += `<line x1="${segment.start.x}" y1="${segment.start.y}" x2="${segment.end.x}" y2="${segment.end.y}" stroke="${segment.color}" stroke-width="2"/>`;
      
      if (withAnnotations) {
        // Add length annotation
        const midX = (segment.start.x + segment.end.x) / 2;
        const midY = (segment.start.y + segment.end.y) / 2;
        svg += `<text x="${midX + 5}" y="${midY - 5}" fill="black" font-size="10" font-family="Arial">L:${segment.length.toFixed(1)}</text>`;
        svg += `<text x="${midX + 5}" y="${midY + 10}" fill="black" font-size="10" font-family="Arial">A:${segment.angle.toFixed(1)}°</text>`;
      }
    });
    
    // Add start point marker
    svg += `<circle cx="${params.startPoint.x}" cy="${params.startPoint.y}" r="4" fill="red"/>`;
    
    svg += '</svg>';
    return svg;
  }

  static exportToJSON(state: DrawingState, params: DrawingParameters): string {
    const data = {
      parameters: params,
      segments: state.segments,
      metadata: {
        totalSegments: state.segments.length,
        totalLength: state.segments.reduce((sum, seg) => sum + seg.length, 0),
        exportedAt: new Date().toISOString()
      }
    };
    return JSON.stringify(data, null, 2);
  }

  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  static canvasToPNG(canvas: HTMLCanvasElement, filename: string): void {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }
}

export class PresetManager {
  private static STORAGE_KEY = 'bendscape-presets';

  static savePreset(name: string, parameters: DrawingParameters): void {
    const presets = this.loadPresets();
    const preset: PresetData = {
      name,
      parameters,
      timestamp: Date.now()
    };
    
    // Remove existing preset with same name
    const filtered = presets.filter(p => p.name !== name);
    filtered.push(preset);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  static loadPresets(): PresetData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static deletePreset(name: string): void {
    const presets = this.loadPresets();
    const filtered = presets.filter(p => p.name !== name);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  static getDefaultParameters(): DrawingParameters {
    return {
      lengthMode: 'random',
      fixedLength: 50,
      minLength: 20,
      maxLength: 100,
      angleMode: 'fixed',
      fixedAngle: 45,
      minAngle: 30,
      maxAngle: 60,
      colorMode: 'random',
      fixedColor: '#000000',
      colorPalette: 'pastel',
      stoppingCondition: 'count',
      minDistance: 20,
      maxLines: 100,
      startPoint: { x: 400, y: 300 },
      canvasWidth: 800,
      canvasHeight: 600
    };
  }
}
