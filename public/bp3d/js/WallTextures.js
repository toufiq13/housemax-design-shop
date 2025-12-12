const wallTextures = [
    {
        name: "Marble Tiles",
        url: "rooms/textures/marble_tiles.jpg",
        thumbnail: "rooms/thumbnails/marble_tiles.jpg",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Light Brick",
        url: "rooms/textures/light_brick.jpg",
        thumbnail: "rooms/thumbnails/light_brick.jpg",
        autoRepeat: true,
        scale: 1,
    },
    {
        name: "Klinkers",
        url: "rooms/textures/klinkers.jpg",
        thumbnail: "rooms/thumbnails/klinkers.jpg",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Red Brick",
        url: "rooms/textures/red_brick.jpg",
        thumbnail: "rooms/thumbnails/red_brick.jpg",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Tiles1",
        url: "rooms/textures/tiles1.jpg",
        thumbnail: "rooms/thumbnails/tiles1.jpg",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Patio Tiles",
        url: "rooms/textures/patio_tiles.jpg",
        thumbnail: "rooms/thumbnails/patio_tiles.jpg",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Plaster Brick",
        url: "rooms/textures/plaster_brick.jpg",
        thumbnail: "rooms/thumbnails/plaster_brick.jpg",
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
    {
        name: "Concrete2",
        url: "rooms/textures/concrete2.jpg",
        thumbnail: "rooms/thumbnails/concrete2.jpg",
        autoRepeat: true,
        scale: 3,
    },
    {
        name: "Wallmap",
        url: "rooms/textures/wallmap.png",
        thumbnail: "rooms/textures/wallmap.png",
        autoRepeat: false,
        scale: 1,
    },
    {
        name: "Wallmap Light",
        url: "rooms/textures/wallmap_light.png",
        thumbnail: "rooms/textures/wallmap_light.png",
        autoRepeat: false,
        scale: 1,
    },
    {
        name: "Wallmap Yellow",
        url: "rooms/textures/wallmap_yellow.png",
        thumbnail: "rooms/textures/wallmap_yellow.png",
        autoRepeat: false,
        scale: 1,
    },
    {
        name: "Wallmap White",
        url: "rooms/textures/wallmap_white.png",
        thumbnail: "rooms/textures/wallmap_white.png",
        autoRepeat: true,
        scale: 1,
    },
    {
        name: "Wallmap Blue",
        url: "rooms/textures/wallmap_blue.png",
        thumbnail: "rooms/textures/wallmap_blue.png",
        autoRepeat: true,
        scale: 1,
    },
    {
        name: "Wallmap Green",
        url: "rooms/textures/wallmap_green.png",
        thumbnail: "rooms/textures/wallmap_green.png",
        autoRepeat: true,
        scale: 1,
    },
    {
        name: "Sandstone Stack",
        url: "rooms/textures/sandstone_stack.png",
        thumbnail: "rooms/thumbnails/sandstone_stack.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Slate 3D Blocks",
        url: "rooms/textures/slate_3d_blocks.png",
        thumbnail: "rooms/thumbnails/slate_3d_blocks.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Floral Triangle",
        url: "rooms/textures/floral_triangle.png",
        thumbnail: "rooms/thumbnails/floral_triangle.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Lily Beige Tiles",
        url: "rooms/textures/lily_beige_tiles.png",
        thumbnail: "rooms/thumbnails/lily_beige_tiles.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Beige Geometric",
        url: "rooms/textures/beige_geometric.png",
        thumbnail: "rooms/thumbnails/beige_geometric.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Colorful Geo",
        url: "rooms/textures/colorful_geo.png",
        thumbnail: "rooms/thumbnails/colorful_geo.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Blue Damask",
        url: "rooms/textures/blue_damask.png",
        thumbnail: "rooms/thumbnails/blue_damask.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Wave 3D Pattern",
        url: "rooms/textures/wave_3d_pattern.png",
        thumbnail: "rooms/thumbnails/wave_3d_pattern.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Modern Patchwork",
        url: "rooms/textures/modern_patchwork.png",
        thumbnail: "rooms/thumbnails/modern_patchwork.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Turkish Blue Wall",
        url: "rooms/textures/turkish_blue_wall.png",
        thumbnail: "rooms/thumbnails/turkish_blue_wall.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Brown Medallion",
        url: "rooms/textures/brown_medallion.png",
        thumbnail: "rooms/thumbnails/brown_medallion.png",
        autoRepeat: true,
        scale: 2,
    },
    {
        name: "Terracotta Sunburst Wall",
        url: "rooms/textures/terracotta_sunburst_wall.png",
        thumbnail: "rooms/thumbnails/terracotta_sunburst_wall.png",
        autoRepeat: true,
        scale: 2,
    },
    // {
    //     name: "",
    //     url: "rooms/textures/",
    //     thumbnail: "rooms/thumbnails/",
    //     autoRepeat: true,
    //     scale: 1,
    // },
];

export class WallTextures {
    constructor() {
        this.init();
    }

    createItem(item) {
        return `
          <div class="col-sm-6" style="padding: 3px">
              <a href="#" class="thumbnail texture-select-thumbnail"
                  texture-url="${item.url}"
                  texture-autoRepeat="${item.autoRepeat}"
                  texture-scale="${item.scale}"
                  title="${item.name}">
                  <img alt="Thumbnail light brick" src="${item.thumbnail}" />
              </a>
          </div>
      `;
    }

    init() {
        var container = $("#wallTexturesDiv");

        let itemsStr = "";
        const items = wallTextures;
        for (var i = 0; i < items.length; i++) {
            itemsStr += this.createItem(items[i]);
        }

        const html = `
            <div class="panel panel-default">
                <div class="panel-heading">Adjust Wall</div>
                <div class="panel-body" style="color: #333333">
                    ${itemsStr}
                </div>
            </div>
        `;
        container.append(html);
    }
}