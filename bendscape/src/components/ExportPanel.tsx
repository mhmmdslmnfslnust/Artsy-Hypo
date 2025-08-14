'use client';

import React from 'react';
import { DrawingState, DrawingParameters } from '@/types';
import { ExportUtils } from '@/lib/utils';

interface ExportPanelProps {
  state: DrawingState;
  parameters: DrawingParameters;
  canvas: HTMLCanvasElement | null;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  state,
  parameters,
  canvas,
  showAnnotations,
  onToggleAnnotations
}) => {
  const handleExportSVG = () => {
    const svg = ExportUtils.exportToSVG(state, parameters, showAnnotations);
    const filename = `bendscape-${Date.now()}.svg`;
    ExportUtils.downloadFile(svg, filename, 'image/svg+xml');
  };

  const handleExportJSON = () => {
    const json = ExportUtils.exportToJSON(state, parameters);
    const filename = `bendscape-${Date.now()}.json`;
    ExportUtils.downloadFile(json, filename, 'application/json');
  };

  const handleExportPNG = () => {
    if (canvas) {
      const filename = `bendscape-${Date.now()}.png`;
      ExportUtils.canvasToPNG(canvas, filename);
    }
  };

  const totalLength = state.segments.reduce((sum, seg) => sum + seg.length, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Export & Analysis</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-600">Total Segments:</span>
          <span className="ml-2 text-gray-800">{state.segments.length}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Total Length:</span>
          <span className="ml-2 text-gray-800">{totalLength.toFixed(1)}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Status:</span>
          <span className="ml-2 text-gray-800">{state.isComplete ? 'Complete' : 'In Progress'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Canvas Size:</span>
          <span className="ml-2 text-gray-800">{parameters.canvasWidth}×{parameters.canvasHeight}</span>
        </div>
      </div>

      {/* Annotations Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="annotations"
          checked={showAnnotations}
          onChange={onToggleAnnotations}
          className="rounded"
        />
        <label htmlFor="annotations" className="text-sm text-gray-700">
          Show length & angle annotations
        </label>
      </div>

      {/* Export Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleExportPNG}
          disabled={!canvas || state.segments.length === 0}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          📷 Export as PNG
        </button>
        <button
          onClick={handleExportSVG}
          disabled={state.segments.length === 0}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          🎨 Export as SVG
        </button>
        <button
          onClick={handleExportJSON}
          disabled={state.segments.length === 0}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          📋 Export Data (JSON)
        </button>
      </div>

      {/* Individual segment data */}
      {state.segments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Segment Details</h3>
          <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
            {state.segments.map((segment, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                <span className="font-medium">#{index + 1}</span>
                <span>L: {segment.length.toFixed(1)}</span>
                <span>A: {segment.angle.toFixed(1)}°</span>
                <span 
                  className="w-4 h-4 rounded border border-gray-300" 
                  style={{ backgroundColor: segment.color }}
                  title={segment.color}
                ></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
