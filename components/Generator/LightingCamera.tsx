'use client';

import { Select } from '@/components/UI';
import stylesData from '@/data/styles.json';

interface LightingCameraProps {
  lighting: string;
  camera: string;
  onLightingChange: (value: string) => void;
  onCameraChange: (value: string) => void;
}

export function LightingCamera({
  lighting,
  camera,
  onLightingChange,
  onCameraChange,
}: LightingCameraProps) {
  const lightingOptions = [
    { value: '', label: 'No specific lighting' },
    ...stylesData.lighting.map((l) => ({
      value: l.value,
      label: l.name,
    })),
  ];

  const cameraOptions = [
    { value: '', label: 'No specific camera' },
    ...stylesData.cameras.map((c) => ({
      value: c.value,
      label: c.name,
    })),
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
        Lighting & Camera
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Lighting"
          value={lighting}
          options={lightingOptions}
          onChange={onLightingChange}
          placeholder="Select lighting..."
        />
        <Select
          label="Camera / Lens"
          value={camera}
          options={cameraOptions}
          onChange={onCameraChange}
          placeholder="Select camera..."
        />
      </div>
    </div>
  );
}

// Yardımcı fonksiyonlar
export function getLightingValue(id: string): string {
  return stylesData.lighting.find((l) => l.id === id)?.value || '';
}

export function getCameraValue(id: string): string {
  return stylesData.cameras.find((c) => c.id === id)?.value || '';
}

