'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { DrawingParameters, DrawingState } from '@/types';
import { DrawingEngine } from '@/lib/drawing-engine';
import { PresetManager } from '@/lib/utils';
import { Canvas } from '@/components/Canvas';
import { ControlPanel } from '@/components/ControlPanel';
import { ExportPanel } from '@/components/ExportPanel';

export default function Home() {
  const [parameters, setParameters] = useState<DrawingParameters>(() => 
    PresetManager.getDefaultParameters()
  );
  const [drawingState, setDrawingState] = useState<DrawingState>(() => ({
    segments: [],
    currentPoint: parameters.startPoint,
    currentAngle: 0,
    isComplete: false,
    totalLines: 0
  }));
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [engine] = useState(() => new DrawingEngine(parameters));

  // Update engine when parameters change
  useEffect(() => {
    engine.updateStrategies(parameters);
  }, [engine, parameters]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate some delay for better UX
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const newState = engine.generateComplete(parameters);
      setDrawingState(newState);
    } catch (error) {
      console.error('Error generating art:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [engine, parameters]);

  const handleClear = useCallback(() => {
    setDrawingState({
      segments: [],
      currentPoint: parameters.startPoint,
      currentAngle: 0,
      isComplete: false,
      totalLines: 0
    });
  }, [parameters.startPoint]);

  const handleRandomize = useCallback(() => {
    const randomParams: DrawingParameters = {
      ...parameters,
      lengthMode: Math.random() < 0.5 ? 'fixed' : 'random',
      fixedLength: Math.floor(Math.random() * 150) + 25,
      minLength: Math.floor(Math.random() * 40) + 10,
      maxLength: Math.floor(Math.random() * 200) + 50,
      angleMode: Math.random() < 0.5 ? 'fixed' : 'random',
      fixedAngle: Math.floor(Math.random() * 170) + 10,
      minAngle: Math.floor(Math.random() * 60) + 10,
      maxAngle: Math.floor(Math.random() * 120) + 60,
      colorMode: Math.random() < 0.3 ? 'fixed' : 'random',
      colorPalette: ['pastel', 'bold', 'monochrome'][Math.floor(Math.random() * 3)] as 'pastel' | 'bold' | 'monochrome',
      stoppingCondition: ['distance', 'count', 'exact'][Math.floor(Math.random() * 3)] as 'distance' | 'count' | 'exact',
      minDistance: Math.floor(Math.random() * 50) + 10,
      maxLines: Math.floor(Math.random() * 400) + 50
    };
    setParameters(randomParams);
  }, [parameters]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'g':
            event.preventDefault();
            handleGenerate();
            break;
          case 'r':
            event.preventDefault();
            handleRandomize();
            break;
          case 'c':
            event.preventDefault();
            handleClear();
            break;
          case 'a':
            event.preventDefault();
            setShowAnnotations(prev => !prev);
            break;
        }
      }
      
      if (event.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, handleRandomize, handleClear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 Bendscape
          </h1>
          <p className="text-gray-600 mb-4">
            Interactive art generator for creating bendable line patterns
          </p>
          <div className="text-sm text-gray-500 space-x-4">
            <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+G</kbd> Generate
            <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+R</kbd> Randomize
            <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+C</kbd> Clear
            <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+A</kbd> Toggle Annotations
            <kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd> Clear
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              parameters={parameters}
              onParametersChange={setParameters}
              onGenerate={handleGenerate}
              onClear={handleClear}
              onRandomize={handleRandomize}
              isGenerating={isGenerating}
            />
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Canvas
                state={drawingState}
                parameters={parameters}
                showAnnotations={showAnnotations}
                onCanvasReady={setCanvas}
              />
            </div>
          </div>

          {/* Export Panel */}
          <div className="lg:col-span-1">
            <ExportPanel
              state={drawingState}
              parameters={parameters}
              canvas={canvas}
              showAnnotations={showAnnotations}
              onToggleAnnotations={() => setShowAnnotations(prev => !prev)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Built with Next.js, TypeScript, and HTML5 Canvas</p>
        </div>
      </div>
    </div>
  );
}
