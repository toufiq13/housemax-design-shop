import React from 'react';
import Navbar from "@/components/Navbar";

const PlanViewer = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-16">
                <iframe
                    src="/bp3d/view_plan.html"
                    className="w-full h-full border-0"
                    title="3D Plan Viewer"
                    allow="fullscreen"
                    style={{
                        border: 'none',
                        display: 'block',
                        width: '100%',
                        height: 'calc(100vh - 64px)'
                    }}
                />
            </div>
        </div>
    );
};

export default PlanViewer;
