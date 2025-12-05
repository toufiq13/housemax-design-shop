import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, X } from "lucide-react";

interface PlannerContextMenuProps {
    viewer3d: any;
}

export const PlannerContextMenu = ({ viewer3d }: PlannerContextMenuProps) => {
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, depth: 0 });
    const [isFixed, setIsFixed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const DisplayUnitToMeterFactor = 100; // cm to meters

    useEffect(() => {
        if (!viewer3d) return;

        const handleEntitySelected = (entity: any) => {
            setSelectedEntity(entity);
            setIsVisible(true);

            if (entity) {
                setDimensions({
                    width: (entity.getWidth() * DisplayUnitToMeterFactor),
                    height: (entity.getHeight() * DisplayUnitToMeterFactor),
                    depth: (entity.getDepth() * DisplayUnitToMeterFactor),
                });
                setIsFixed(entity.fixed || false);
            }
        };

        const handleEntityUnselected = () => {
            setSelectedEntity(null);
            setIsVisible(false);
        };

        viewer3d.entitySelectedCallbacks.add(handleEntitySelected);
        viewer3d.entityUnselectedCallbacks.add(handleEntityUnselected);

        return () => {
            viewer3d.entitySelectedCallbacks.remove(handleEntitySelected);
            viewer3d.entityUnselectedCallbacks.remove(handleEntityUnselected);
        };
    }, [viewer3d]);

    const handleResize = (key: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        const newDims = { ...dimensions, [key]: numValue };
        setDimensions(newDims);

        if (selectedEntity) {
            selectedEntity.resize(
                newDims.height / DisplayUnitToMeterFactor,
                newDims.width / DisplayUnitToMeterFactor,
                newDims.depth / DisplayUnitToMeterFactor
            );
        }
    };

    const handleDelete = () => {
        if (selectedEntity && viewer3d) {
            viewer3d.removeEntity(selectedEntity);
            setSelectedEntity(null);
            setIsVisible(false);
        }
    };

    const handleFixedChange = (checked: boolean) => {
        setIsFixed(checked);
        if (selectedEntity) {
            selectedEntity.setFixed(checked);
        }
    };

    if (!isVisible || !selectedEntity) return null;

    return (
        <Card className="absolute top-4 right-4 w-64 shadow-xl z-50 bg-background/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {selectedEntity.metadata?.entityName || "Selected Item"}
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsVisible(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <Label htmlFor="width" className="text-xs">Width (cm)</Label>
                        <Input
                            id="width"
                            type="number"
                            value={dimensions.width.toFixed(1)}
                            onChange={(e) => handleResize("width", e.target.value)}
                            disabled={!selectedEntity.resizable}
                            className="h-8"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="height" className="text-xs">Height (cm)</Label>
                        <Input
                            id="height"
                            type="number"
                            value={dimensions.height.toFixed(1)}
                            onChange={(e) => handleResize("height", e.target.value)}
                            disabled={!selectedEntity.resizable}
                            className="h-8"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="depth" className="text-xs">Depth (cm)</Label>
                        <Input
                            id="depth"
                            type="number"
                            value={dimensions.depth.toFixed(1)}
                            onChange={(e) => handleResize("depth", e.target.value)}
                            disabled={!selectedEntity.resizable}
                            className="h-8"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="fixed" checked={isFixed} onCheckedChange={handleFixedChange} />
                    <Label htmlFor="fixed" className="text-sm">Fixed Position</Label>
                </div>

                <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Item
                </Button>
            </CardContent>
        </Card>
    );
};
