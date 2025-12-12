import React, { useEffect } from 'react';
import { toast } from "sonner";

export const BP3DPlanner: React.FC = () => {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'BP3D_ERROR') {
                console.error('BP3D Planner Error:', event.data.payload);
                toast.error(`3D Planner Error: ${event.data.payload.message}`);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

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
