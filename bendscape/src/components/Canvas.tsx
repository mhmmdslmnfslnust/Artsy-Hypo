'use client';

import React, { useRef, useEffect, useCallback } from 'react';
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
    
    // Set background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  }, [state, parameters, drawSegment]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (onCanvasReady && canvasRef.current) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <canvas
        ref={canvasRef}
        width={parameters.canvasWidth}
        height={parameters.canvasHeight}
        className="block"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};
