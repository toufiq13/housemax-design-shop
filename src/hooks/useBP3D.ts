import { useEffect, useRef, useState } from "react";

// We need to ignore types for now as we are using a pre-built JS library without d.ts
// @ts-ignore
import { Viewer2d, Viewer3d } from "@/lib/bp3d/core";
// @ts-ignore
import {
    AxisGizmoPlugin,
    BottomBarPlugin,
    GroundGridPlugin,
    PlanToolbarPlugin,
    SkyboxPlugin,
    ToolbarPlugin,
    TransformPlugin,
    ViewCubePlugin,
} from "@/lib/bp3d/plugins";

export const useBP3D = (container3dId: string, container2dId: string) => {
    const [viewer3d, setViewer3d] = useState<any>(null);
    const [viewer2d, setViewer2d] = useState<any>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        // Ensure DOM elements exist
        const container3d = document.getElementById(container3dId);
        const container2d = document.getElementById(container2dId);

        if (!container3d || !container2d) return;

        initialized.current = true;

        const language = "en"; // Force English
        const v3d = new Viewer3d({ containerId: container3dId, language });
        const v2d = new Viewer2d({ containerId: container2dId }, v3d);

        // Initialize plugins
        new AxisGizmoPlugin(v3d);
        new BottomBarPlugin(v3d);
        new GroundGridPlugin(v3d);
        new PlanToolbarPlugin(v3d, { language });
        new SkyboxPlugin(v3d);
        new ToolbarPlugin(v3d, { language });
        new TransformPlugin(v3d, { language });
        new ViewCubePlugin(v3d, { language });

        setViewer3d(v3d);
        setViewer2d(v2d);

        // Load default plan or empty plan
        // v3d.loadPlan("/bp3d/plans/new_plan.json"); 

        // Texture Selection Logic
        let currentTarget: any = null;

        v3d.wallClicked.add((halfEdge: any) => {
            currentTarget = halfEdge;
        });

        v3d.floorClicked.add((room: any) => {
            currentTarget = room;
        });

        v3d.nothingClicked.add(() => {
            currentTarget = null;
        });

        const handleTextureSelected = (e: Event) => {
            const customEvent = e as CustomEvent;
            const texture = customEvent.detail;

            if (currentTarget) {
                const textureConfig = {
                    url: `/bp3d/${texture.url}`,
                    repeat: {
                        autoCalculateRepeat: texture.autoRepeat,
                        uvScale: texture.scale,
                    },
                };
                currentTarget.setMaterialConfig({ texture: textureConfig });
            }
        };

        window.addEventListener("bp3d-texture-selected", handleTextureSelected);

        // Expose to window for debugging if needed
        (window as any).viewer3d = v3d;

        return () => {
            window.removeEventListener("bp3d-texture-selected", handleTextureSelected);
            // v3d.destroy(); 
        };
    }, [container3dId, container2dId]);

    return { viewer3d, viewer2d };
};
