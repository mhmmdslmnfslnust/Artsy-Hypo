'use client';

import React from 'react';
import { DrawingParameters } from '@/types';
import { PresetManager } from '@/lib/utils';

interface ControlPanelProps {
  parameters: DrawingParameters;
  onParametersChange: (params: DrawingParameters) => void;
  onGenerate: () => void;
  onClear: () => void;
  onRandomize: () => void;
  isGenerating?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  parameters,
  onParametersChange,
  onGenerate,
  onClear,
  onRandomize,
  isGenerating = false
}) => {
  const updateParameter = <K extends keyof DrawingParameters>(
    key: K,
    value: DrawingParameters[K]
  ) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  const handlePresetSave = () => {
    const name = prompt('Enter preset name:');
    if (name) {
      PresetManager.savePreset(name, parameters);
    }
  };

  const handlePresetLoad = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = event.target.value;
    if (presetName) {
      const presets = PresetManager.loadPresets();
      const preset = presets.find(p => p.name === presetName);
      if (preset) {
        onParametersChange(preset.parameters);
      }
    }
  };

  const presets = PresetManager.loadPresets();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Bendscape Controls</h2>
        <div className="flex gap-2">
          <button
            onClick={onRandomize}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            🎲 Random
          </button>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? '⏳ Generating...' : '🎨 Generate'}
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Presets</label>
        <div className="flex gap-2">
          <select
            onChange={handlePresetLoad}
            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            defaultValue=""
          >
            <option value="">Select preset...</option>
            {presets.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
          <button
            onClick={handlePresetSave}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Length Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Length Settings</h3>
        <div className="space-y-2">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="lengthMode"
                value="fixed"
                checked={parameters.lengthMode === 'fixed'}
                onChange={(e) => updateParameter('lengthMode', e.target.value as 'fixed' | 'random')}
                className="mr-2"
              />
              Fixed
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="lengthMode"
                value="random"
                checked={parameters.lengthMode === 'random'}
                onChange={(e) => updateParameter('lengthMode', e.target.value as 'fixed' | 'random')}
                className="mr-2"
              />
              Random
            </label>
          </div>
          
          {parameters.lengthMode === 'fixed' ? (
            <div>
              <label className="block text-sm text-gray-600">Fixed Length: {parameters.fixedLength}</label>
              <input
                type="range"
                min="10"
                max="200"
                value={parameters.fixedLength}
                onChange={(e) => updateParameter('fixedLength', Number(e.target.value))}
                className="w-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600">Min: {parameters.minLength}</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={parameters.minLength}
                  onChange={(e) => updateParameter('minLength', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Max: {parameters.maxLength}</label>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={parameters.maxLength}
                  onChange={(e) => updateParameter('maxLength', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Angle Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Angle Settings</h3>
        <div className="space-y-2">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="angleMode"
                value="fixed"
                checked={parameters.angleMode === 'fixed'}
                onChange={(e) => updateParameter('angleMode', e.target.value as 'fixed' | 'random')}
                className="mr-2"
              />
              Fixed
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="angleMode"
                value="random"
                checked={parameters.angleMode === 'random'}
                onChange={(e) => updateParameter('angleMode', e.target.value as 'fixed' | 'random')}
                className="mr-2"
              />
              Random
            </label>
          </div>
          
          {parameters.angleMode === 'fixed' ? (
            <div>
              <label className="block text-sm text-gray-600">Fixed Angle: {parameters.fixedAngle}°</label>
              <input
                type="range"
                min="1"
                max="180"
                value={parameters.fixedAngle}
                onChange={(e) => updateParameter('fixedAngle', Number(e.target.value))}
                className="w-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600">Min: {parameters.minAngle}°</label>
                <input
                  type="range"
                  min="1"
                  max="90"
                  value={parameters.minAngle}
                  onChange={(e) => updateParameter('minAngle', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Max: {parameters.maxAngle}°</label>
                <input
                  type="range"
                  min="10"
                  max="180"
                  value={parameters.maxAngle}
                  onChange={(e) => updateParameter('maxAngle', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Color Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Color Settings</h3>
        <div className="space-y-2">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="colorMode"
                value="fixed"
                checked={parameters.colorMode === 'fixed'}
                onChange={(e) => updateParameter('colorMode', e.target.value as 'fixed' | 'random')}
                className="mr-2"
              />
              Fixed
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="colorMode"
                value="random"
                checked={parameters.colorMode === 'random'}
                onChange={(e) => updateParameter('colorMode', e.target.value as 'fixed' | 'random')}
                className="mr-2"
              />
              Random
            </label>
          </div>
          
          {parameters.colorMode === 'fixed' ? (
            <div>
              <label className="block text-sm text-gray-600">Color</label>
              <input
                type="color"
                value={parameters.fixedColor}
                onChange={(e) => updateParameter('fixedColor', e.target.value)}
                className="w-full h-10 rounded border"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-600">Palette</label>
              <select
                value={parameters.colorPalette}
                onChange={(e) => updateParameter('colorPalette', e.target.value as 'pastel' | 'bold' | 'monochrome')}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="pastel">Pastel</option>
                <option value="bold">Bold</option>
                <option value="monochrome">Monochrome</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stopping Conditions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Stopping Conditions</h3>
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="stoppingCondition"
                value="distance"
                checked={parameters.stoppingCondition === 'distance'}
                onChange={(e) => updateParameter('stoppingCondition', e.target.value as 'distance' | 'count' | 'exact')}
                className="mr-2"
              />
              Distance from start
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="stoppingCondition"
                value="count"
                checked={parameters.stoppingCondition === 'count'}
                onChange={(e) => updateParameter('stoppingCondition', e.target.value as 'distance' | 'count' | 'exact')}
                className="mr-2"
              />
              Number of lines
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="stoppingCondition"
                value="exact"
                checked={parameters.stoppingCondition === 'exact'}
                onChange={(e) => updateParameter('stoppingCondition', e.target.value as 'distance' | 'count' | 'exact')}
                className="mr-2"
              />
              Exact return to start
            </label>
          </div>
          
          {parameters.stoppingCondition === 'distance' && (
            <div>
              <label className="block text-sm text-gray-600">Min Distance: {parameters.minDistance}px</label>
              <input
                type="range"
                min="5"
                max="100"
                value={parameters.minDistance}
                onChange={(e) => updateParameter('minDistance', Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          
          {parameters.stoppingCondition === 'count' && (
            <div>
              <label className="block text-sm text-gray-600">Max Lines: {parameters.maxLines}</label>
              <input
                type="range"
                min="10"
                max="500"
                value={parameters.maxLines}
                onChange={(e) => updateParameter('maxLines', Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
