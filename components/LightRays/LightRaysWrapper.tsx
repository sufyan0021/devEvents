'use client';

import dynamic from 'next/dynamic';

// Dynamically import LightRays with SSR disabled inside a Client Component
const LightRays = dynamic(() => import('@/components/LightRays/LightRays'), {
  ssr: false,
});

export default function LightRaysWrapper() {
  return (
    <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
      <LightRays
        raysOrigin="top-center-offset"
        raysColor="#5dfeca"
        raysSpeed={0.5}
        lightSpread={0.9}
        rayLength={1.4}
        followMouse={true}
        mouseInfluence={0.02}
        noiseAmount={0.0}
        distortion={0.01}
      />
    </div>
  );
}
