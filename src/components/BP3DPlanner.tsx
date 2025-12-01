import React, { useRef } from 'react';

const BP3DPlanner: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="w-full h-full" style={{ height: '800px' }}>
      {/* BP3D Viewer iframe - matches original bp3d-examples exactly */}
      <iframe
        ref={iframeRef}
        src="/bp3d-viewer.html"
        className="w-full h-full border-0"
        title="BP3D Planner"
        allow="fullscreen"
        style={{
          border: 'none',
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default BP3DPlanner;

