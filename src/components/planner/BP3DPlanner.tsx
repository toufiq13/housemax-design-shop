import React from 'react';

export const BP3DPlanner: React.FC = () => {
    return (
        <div className="w-full" style={{ height: '100vh' }}>
            <iframe
                src="/bp3d-planner.html"
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
