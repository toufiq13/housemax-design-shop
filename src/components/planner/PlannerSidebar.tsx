import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntityLibrary } from "./EntityLibrary";
import { TextureLibrary } from "./TextureLibrary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Armchair, Palette } from "lucide-react";

interface PlannerSidebarProps {
    viewer3d: any;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const PlannerSidebar = ({ viewer3d, activeTab, onTabChange }: PlannerSidebarProps) => {
    return (
        <div className="h-full flex flex-col bg-background">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Planner Tools</h2>
            </div>

            <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
                <div className="px-4 pt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="floorplan" className="text-xs">
                            <LayoutDashboard className="h-4 w-4 mr-1" />
                            Floor
                        </TabsTrigger>
                        <TabsTrigger value="design" className="text-xs">
                            <Palette className="h-4 w-4 mr-1" />
                            Design
                        </TabsTrigger>
                        <TabsTrigger value="shop" className="text-xs">
                            <Armchair className="h-4 w-4 mr-1" />
                            Shop
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <TabsContent value="floorplan" className="mt-0 space-y-4">
                        <div className="text-sm text-muted-foreground">
                            <p className="mb-2">Edit your floorplan in 2D mode.</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Draw walls</li>
                                <li>Move walls</li>
                                <li>Delete walls</li>
                            </ul>
                            <p className="mt-4 text-xs">
                                Use the toolbar at the bottom of the viewer to switch modes.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="design" className="mt-0">
                        <TextureLibrary viewer3d={viewer3d} />
                    </TabsContent>

                    <TabsContent value="shop" className="mt-0">
                        <EntityLibrary viewer3d={viewer3d} />
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </div>
    );
};
