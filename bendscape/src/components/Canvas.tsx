'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { DrawingState, DrawingParameters, LineSegment } from '@/types';

interface CanvasProps {
  state: DrawingState;
  parameters: DrawingParameters;
  showAnnotations?: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  state, 
  parameters, 
  showAnnotations = false,
  onCanvasReady 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const drawSegment = useCallback((ctx: CanvasRenderingContext2D, segment: LineSegment, index: number) => {
    // Draw line
    ctx.beginPath();
    ctx.moveTo(segment.start.x, segment.start.y);
    ctx.lineTo(segment.end.x, segment.end.y);
    ctx.strokeStyle = segment.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (showAnnotations) {
      // Draw annotations
      const midX = (segment.start.x + segment.end.x) / 2;
      const midY = (segment.start.y + segment.end.y) / 2;
      
      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      ctx.fillText(`L:${segment.length.toFixed(1)}`, midX + 5, midY - 5);
      ctx.fillText(`A:${segment.angle.toFixed(1)}°`, midX + 5, midY + 10);
      
      // Draw segment number
      ctx.fillStyle = 'blue';
      ctx.fillText(`${index + 1}`, segment.start.x - 10, segment.start.y - 10);
    }
  }, [showAnnotations]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context for transformations
    ctx.save();
    
    // Apply zoom and pan transformations
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Set background
    ctx.fillStyle = 'white';
    ctx.fillRect(-pan.x / zoom, -pan.y / zoom, canvas.width / zoom, canvas.height / zoom);

    // Draw all segments
    state.segments.forEach((segment, index) => {
      drawSegment(ctx, segment, index);
    });

    // Draw start point
    ctx.beginPath();
    ctx.arc(parameters.startPoint.x, parameters.startPoint.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    
    // Add label for start point
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('START', parameters.startPoint.x + 8, parameters.startPoint.y - 8);

    // Draw current endpoint if drawing is not complete
    if (!state.isComplete && state.segments.length > 0) {
      const lastSegment = state.segments[state.segments.length - 1];
      ctx.beginPath();
      ctx.arc(lastSegment.end.x, lastSegment.end.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'green';
      ctx.fill();
    }
    
    // Restore context
    ctx.restore();
  }, [state, parameters, drawSegment, zoom, pan]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (onCanvasReady && canvasRef.current) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  // Zoom and Pan handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * zoomFactor)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const fitToCanvas = useCallback(() => {
    if (state.segments.length === 0) return;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    state.segments.forEach(segment => {
      minX = Math.min(minX, segment.start.x, segment.end.x);
      minY = Math.min(minY, segment.start.y, segment.end.y);
      maxX = Math.max(maxX, segment.start.x, segment.end.x);
      maxY = Math.max(maxY, segment.start.y, segment.end.y);
    });
    
    const padding = 50;
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;
    
    const scaleX = parameters.canvasWidth / contentWidth;
    const scaleY = parameters.canvasHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9;
    
    setZoom(scale);
    setPan({
      x: -minX * scale + padding * scale + (parameters.canvasWidth - contentWidth * scale) / 2,
      y: -minY * scale + padding * scale + (parameters.canvasHeight - contentHeight * scale) / 2
    });
  }, [state.segments, parameters.canvasWidth, parameters.canvasHeight]);

  return (
    <div className="relative">
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-gray-100 relative"
        style={{ width: 'fit-content', maxWidth: '100%' }}
      >
        <canvas
          ref={canvasRef}
          width={parameters.canvasWidth}
          height={parameters.canvasHeight}
          className="block cursor-grab active:cursor-grabbing"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            backgroundColor: 'white'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* Zoom Controls Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 bg-white bg-opacity-90 p-2 rounded shadow">
          <button
            onClick={() => setZoom(prev => Math.min(5, prev * 1.2))}
            className="w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.1, prev / 1.2))}
            className="w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-bold"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={resetView}
            className="w-8 h-8 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs"
            title="Reset View"
          >
            ⌂
          </button>
          <button
            onClick={fitToCanvas}
            className="w-8 h-8 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs"
            title="Fit to View"
            disabled={state.segments.length === 0}
          >
            ◯
          </button>
        </div>
        
        {/* Zoom Level Indicator */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {Math.round(zoom * 100)}%
        </div>
        
        {/* Pan Instructions */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          Scroll: Zoom | Drag: Pan
        </div>
      </div>
    </div>
  );
};
