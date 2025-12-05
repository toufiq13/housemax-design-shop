import React from "react";
import { PLANNER_ENTITIES, Entity } from "@/constants/planner-entities";
import { Card } from "@/components/ui/card";

interface EntityLibraryProps {
    viewer3d: any;
}

export const EntityLibrary = ({ viewer3d }: EntityLibraryProps) => {
    const handleEntityClick = (entity: Entity) => {
        if (!viewer3d) return;

        const entityConfig = {
            name: entity.name,
            type: entity.type,
            url: entity.url,
            resizable: true,
        };

        viewer3d.addEntity(entityConfig);
        // Optionally switch to 3D view if not already? 
        // The original app switches to DEFAULT state (3D view)
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {PLANNER_ENTITIES.map((entity, index) => (
                <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden group"
                    onClick={() => handleEntityClick(entity)}
                >
                    <div className="aspect-square relative bg-muted/50 p-2">
                        <img
                            src={entity.image}
                            alt={entity.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            loading="lazy"
                        />
                    </div>
                    <div className="p-2 text-xs text-center font-medium truncate" title={entity.name}>
                        {entity.name}
                    </div>
                </Card>
            ))}
        </div>
    );
};
