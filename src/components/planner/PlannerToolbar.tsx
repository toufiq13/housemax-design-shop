import React from "react";
import { Button } from "@/components/ui/button";
import { Move, PenTool, Trash2, Check } from "lucide-react";

interface PlannerToolbarProps {
    viewer2d: any;
    activeTab: string;
}

export const PlannerToolbar = ({ viewer2d, activeTab }: PlannerToolbarProps) => {
    if (activeTab !== "floorplan" || !viewer2d) return null;

    // Constants from bp3d Viewer2d
    const MODE_MOVE = 0;
    const MODE_DRAW = 1;
    const MODE_DELETE = 2;

    const setMode = (mode: number) => {
        if (viewer2d) {
            viewer2d.mode = mode;
        }
    };

    return (
        <div className="flex items-center gap-2 bg-background/90 backdrop-blur border rounded-full shadow-lg p-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode(MODE_MOVE)}
                className="gap-2 rounded-full"
            >
                <Move className="h-4 w-4" />
                Move Walls
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode(MODE_DRAW)}
                className="gap-2 rounded-full"
            >
                <PenTool className="h-4 w-4" />
                Draw Walls
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode(MODE_DELETE)}
                className="gap-2 rounded-full hover:text-destructive"
            >
                <Trash2 className="h-4 w-4" />
                Delete Walls
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
                size="sm"
                onClick={() => setMode(MODE_MOVE)} // Done usually just resets to move mode
                className="gap-2 rounded-full"
            >
                <Check className="h-4 w-4" />
                Done
            </Button>
        </div>
    );
};
