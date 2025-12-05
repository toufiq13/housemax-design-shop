import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TextureLibraryProps {
    viewer3d: any;
}

const FLOOR_TEXTURES = [
    {
        name: "Light Fine Wood",
        url: "rooms/textures/light_fine_wood.jpg",
        thumbnail: "rooms/thumbnails/light_fine_wood.jpg",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Hard Wood",
        url: "rooms/textures/hardwood.png",
        thumbnail: "rooms/thumbnails/hardwood.png",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Tiles",
        url: "rooms/textures/tiles1.jpg",
        thumbnail: "rooms/thumbnails/tiles1.jpg",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Marble",
        url: "rooms/textures/marble1.jpg",
        thumbnail: "rooms/thumbnails/marble1.jpg",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Concrete",
        url: "rooms/textures/concrete.jpg",
        thumbnail: "rooms/thumbnails/concrete.jpg",
        autoRepeat: true,
        scale: 3,
    },
];

const WALL_TEXTURES = [
    {
        name: "Marble",
        url: "rooms/textures/marbletiles.jpg",
        thumbnail: "rooms/thumbnails/marbletiles.jpg",
        autoRepeat: true,
        scale: 1,
    },
    {
        name: "Wallmap Yellow",
        url: "rooms/textures/wallmap_yellow.png",
        thumbnail: "rooms/thumbnails/wallmap_yellow.png",
        autoRepeat: true,
        scale: 1,
    },
    {
        name: "Light Brick",
        url: "rooms/textures/light_brick.jpg",
        thumbnail: "rooms/thumbnails/light_brick.jpg",
        autoRepeat: true,
        scale: 1,
    },
];

export const TextureLibrary = ({ viewer3d }: TextureLibraryProps) => {
    const handleTextureClick = (texture: any) => {
        if (!viewer3d) return;
        // The original app sets a "current texture" in the TextureSelector
        // which then applies it when a wall/floor is clicked in 3D view.
        // However, we might want to apply it to the selected element if any.

        // For now, let's assume we need to trigger the texture selection mode
        // or pass this to the viewer.

        // Looking at TextureSelector.js, it seems to listen for clicks on the thumbnails
        // and then sets `this.selectedTexture = textureConfig`.
        // Then it listens for mouse clicks in the 3D scene to apply the texture.

        // We need to replicate this logic or expose a method in our hook.
        // Since we don't have easy access to the internal TextureSelector instance from here
        // unless we exposed it, we might need to implement the selection logic here
        // or assume the viewer has a method.

        // Let's try to use a custom event or direct access if possible.
        // Ideally, we should have a `setTextureMode` in our hook.

        // For this implementation, let's assume we can dispatch an event that the
        // TextureSelector (which we initialized in useBP3D) listens to?
        // No, we initialized TextureSelector in useBP3D but didn't expose it.

        // Let's emit a custom event that our TextureSelector wrapper can listen to,
        // or better, let's just use the viewer3d instance if we can.

        // Actually, the best way is to expose the TextureSelector instance in useBP3D.
        // But for now, let's just dispatch a custom event "textureSelected"
        // and we can add a listener in useBP3D to handle it if needed,
        // OR we can just assume the user will click the wall/floor.

        // Wait, the original TextureSelector attaches click listeners to the DOM elements.
        // Since we are replacing the DOM, the original TextureSelector won't work as is.
        // We need to re-implement TextureSelector logic in React or adapt it.

        // The logic in TextureSelector.js:
        // 1. Click thumbnail -> sets `currentTexture`.
        // 2. Mouse move in 3D -> highlights intersected wall/floor.
        // 3. Click in 3D -> applies `currentTexture` to the target.

        // We can implement this in `useBP3D` or a new `useTextureSelector` hook.
        // For now, let's just emit the texture data and handle it in the main component.

        const event = new CustomEvent("bp3d-texture-selected", { detail: texture });
        window.dispatchEvent(event);
    };

    return (
        <Tabs defaultValue="floor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="floor">Floor</TabsTrigger>
                <TabsTrigger value="wall">Wall</TabsTrigger>
            </TabsList>
            <TabsContent value="floor">
                <div className="grid grid-cols-2 gap-4">
                    {FLOOR_TEXTURES.map((texture, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden group"
                            onClick={() => handleTextureClick(texture)}
                        >
                            <div className="aspect-square relative bg-muted/50 p-2">
                                <img
                                    src={`/bp3d/${texture.thumbnail}`}
                                    alt={texture.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-2 text-xs text-center font-medium truncate">
                                {texture.name}
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="wall">
                <div className="grid grid-cols-2 gap-4">
                    {WALL_TEXTURES.map((texture, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden group"
                            onClick={() => handleTextureClick(texture)}
                        >
                            <div className="aspect-square relative bg-muted/50 p-2">
                                <img
                                    src={`/bp3d/${texture.thumbnail}`}
                                    alt={texture.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-2 text-xs text-center font-medium truncate">
                                {texture.name}
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    );
};
