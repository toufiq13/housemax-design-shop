var entities = [
    {
        name: "Closed Door",
        image: "models/thumbnails/closed_door.png",
        url: "models/gltf/closed_door_28x80.glb",
        type: "InWallFloorEntity",
    },
    {
        name: "Open Door",
        image: "models/thumbnails/open_door.png",
        url: "models/gltf/open_door.glb",
        type: "InWallFloorEntity",
    },
    {
        name: "Door",
        image: "models/thumbnails/door.png",
        url: "models/gltf/door.glb",
        type: "InWallFloorEntity",
    },
    {
        name: "Window",
        image: "models/thumbnails/white_window.png",
        url: "models/gltf/white_window.glb",
        type: "InWallEntity",
    },
    {
        name: "Residential Window",
        image: "models/thumbnails/residential_window.png",
        url: "models/gltf/residential_window.glb",
        type: "InWallEntity",
    },
    {
        name: "Glass Window",
        image: "models/thumbnails/glass_window.png",
        url: "models/gltf/glass_window.glb",
        type: "InWallEntity",
    },
    {
        name: "Glass Window 2",
        image: "models/thumbnails/glass_window2.png",
        url: "models/gltf/glass_window2.glb",
        type: "InWallEntity",
    },
    {
        name: "Shop Window",
        image: "models/thumbnails/shop_window.png",
        url: "models/gltf/shop_window.glb",
        type: "InWallEntity",
    },
    {
        name: "Chair",
        image: "models/thumbnails/chair.jpg",
        url: "models/gltf/chair_oak_white.glb",
        type: "FloorEntity",
    },
    {
        name: "Red Chair",
        image: "models/thumbnails/red_chair.png",
        url: "models/gltf/red_chair.glb",
        type: "FloorEntity",
    },
    {
        name: "Blue Chair",
        image: "models/thumbnails/blue_chair.png",
        url: "models/gltf/blue_chair.glb",
        type: "FloorEntity",
    },
    {
        name: "Office Chair",
        image: "models/thumbnails/office_chair.png",
        url: "models/gltf/office_chair.glb",
        type: "FloorEntity",
    },
    {
        name: "Office Chair 2",
        image: "models/thumbnails/office_chair2.png",
        url: "models/gltf/office_chair2.glb",
        type: "FloorEntity",
    },
    {
        name: "Dresser - Dark Wood",
        image: "models/thumbnails/dresser_dark_wood.png",
        url: "models/gltf/dresser_dark_wood.glb",
        type: "FloorEntity",
    },
    {
        name: "Dresser - White",
        image: "models/thumbnails/dresser_white.jpg",
        url: "models/gltf/dresser_white.glb",
        type: "FloorEntity",
    },
    {
        name: "Bedside table - Shale",
        image: "models/thumbnails/bedside_table_shale.jpg",
        url: "models/gltf/bedside_table_shale.glb",
        type: "FloorEntity",
    },
    {
        name: "Bedside table - White",
        image: "models/thumbnails/bedside_table_shale_white.jpg",
        url: "models/gltf/bedside_table_shale_white.glb",
        type: "FloorEntity",
    },
    // {
    //     name: "Wardrobe - White",
    //     image: "models/thumbnails/wardrobe_white.png",
    //     url: "models/gltf/ik_kivine_baked.glb",
    //     type: "FloorEntity",
    // },
    {
        name: "Bed",
        image: "models/thumbnails/bed.png",
        url: "models/gltf/bed.glb",
        type: "FloorEntity",
    },
    {
        name: "Full Bed",
        image: "models/thumbnails/full_bed.jpg",
        url: "models/gltf/full_bed.glb",
        type: "FloorEntity",
    },
    {
        name: "Bookshelf",
        image: "models/thumbnails/bookshelf.jpg",
        url: "models/gltf/bookshelf.glb",
        type: "FloorEntity",
    },
    {
        name: "Media Console - White",
        image: "models/thumbnails/media_console_white.jpg",
        url: "models/gltf/media_console_white.glb",
        type: "FloorEntity",
    },
    // {
    //     name: "Media Console - Black",
    //     image: "models/thumbnails/media_console_black.jpg",
    //     url: "models/gltf/cb_moore_baked.glb",
    //     type: "FloorEntity",
    // },
    // {
    //     name: "Sectional - Olive",
    //     image: "models/thumbnails/sectional_olive.jpg",
    //     url: "models/gltf/we_crosby2piece_greenbaked.glb",
    //     type: "FloorEntity",
    // },
    {
        name: "Sofa - Grey",
        image: "models/thumbnails/sofa_grey.jpg",
        url: "models/gltf/sofa_grey.glb",
        type: "FloorEntity",
    },
    {
        name: "Wooden Trunk",
        image: "models/thumbnails/wooden_trunk.jpg",
        url: "models/gltf/wooden_trunk.glb",
        type: "FloorEntity",
    },
    {
        name: "Floor Lamp",
        image: "models/thumbnails/floor_lamp.png",
        url: "models/gltf/floor_lamp.glb",
        type: "FloorEntity",
    },
    {
        name: "Coffee Table - Wood",
        image: "models/thumbnails/coffee_table_wood.jpg",
        url: "models/gltf/coffee_table_wood.glb",
        type: "FloorEntity",
    },
    {
        name: "Side Table",
        image: "models/thumbnails/side_table.png",
        url: "models/gltf/side_table.glb",
        type: "FloorEntity",
    },
    {
        name: "Dining Table",
        image: "models/thumbnails/dining_table.jpg",
        url: "models/gltf/dining_table.glb",
        type: "FloorEntity",
    },
    // {
    //     name: "Dining table",
    //     image: "models/thumbnails/dining_table2.png",
    //     url: "models/gltf/BlakeAvenuejoshuatreecheftable.glb",
    //     type: "FloorEntity",
    // },
    {
        name: "Blue Rug",
        image: "models/thumbnails/blue_rug.png",
        url: "models/gltf/blue_rug_60x96.glb",
        type: "FloorEntity",
    },
    {
        name: "NYC Poster",
        image: "models/thumbnails/nyc_poster.jpg",
        url: "models/gltf/nyc_poster2.glb",
        type: "WallEntity",
    },
    {
        name: "Wall Clock",
        image: "models/thumbnails/wall_clock.png",
        url: "models/gltf/wall_clock.glb",
        type: "WallEntity",
    },
    {
        name: "Desk",
        image: "models/thumbnails/desk.png",
        url: "models/gltf/desk.glb",
        type: "FloorEntity",
    },
    {
        name: "Back Brace",
        image: "models/thumbnails/back_brace.png",
        url: "models/gltf/back_brace.gltf",
        type: "FloorEntity",
    },
    {
        name: "Checkstand",
        image: "models/thumbnails/checkstand.png",
        url: "models/gltf/checkstand.gltf",
        type: "FloorEntity",
    },
    {
        name: "Shelve",
        image: "models/thumbnails/shelve.png",
        url: "models/gltf/shelve.gltf",
        type: "FloorEntity",
    },
    {
        name: "Shelve2",
        image: "models/thumbnails/shelve2.png",
        url: "models/gltf/shelve2.glb",
        type: "FloorEntity",
    },
    {
        name: "Shelve3",
        image: "models/thumbnails/shelve3.png",
        url: "models/gltf/shelve3.glb",
        type: "FloorEntity",
    },
    {
        name: "Shelf",
        image: "models/thumbnails/shelf.png",
        url: "models/gltf/shelf.glb",
        type: "FloorEntity",
    },
    {
        name: "Shelf 2",
        image: "models/thumbnails/shelf2.png",
        url: "models/gltf/shelf2.glb",
        type: "FloorEntity",
    },
    {
        name: "Shelf 3",
        image: "models/thumbnails/shelf3.png",
        url: "models/gltf/shelf3.glb",
        type: "FloorEntity",
    },
    {
        name: "Glass Window 3",
        image: "models/thumbnails/glass_window3.jpg",
        url: "models/gltf/glass_window3.glb",
        type: "InWallFloorEntity",
    },
    {
        name: "Window",
        image: "models/thumbnails/window.png",
        url: "models/gltf/window.glb",
        type: "InWallEntity",
    },
    {
        name: "Door2",
        image: "models/thumbnails/door2.png",
        url: "models/gltf/door2.glb",
        type: "InWallFloorEntity",
    },
    {
        name: "Zhiyin Storefront",
        image: "models/thumbnails/zhiyin_storefront.png",
        url: "models/gltf/zhiyin_storefront.glb",
        type: "BasicEntity",
    },
    {
        name: "Zhiyin Storefront text",
        image: "models/thumbnails/zhiyin_storefront_text.png",
        url: "models/gltf/zhiyin_storefront_text.glb",
        type: "BasicEntity",
    },
    {
        name: "Zhiyin Storefront background",
        image: "models/thumbnails/zhiyin_storefront_background.png",
        url: "models/gltf/zhiyin_storefront_background.glb",
        type: "BasicEntity",
    },
    {
        name: "小货架A",
        image: "models/thumbnails/小货架A.png",
        url: "models/gltf/小货架A.glb",
        type: "FloorEntity",
    },
    {
        name: "小货架B",
        image: "models/thumbnails/小货架B.png",
        url: "models/gltf/小货架B.glb",
        type: "FloorEntity",
    },
    {
        name: "收银台A",
        image: "models/thumbnails/收银台A.png",
        url: "models/gltf/收银台A.glb",
        type: "FloorEntity",
    },
    {
        name: "收银台B",
        image: "models/thumbnails/收银台B.png",
        url: "models/gltf/收银台B.glb",
        type: "FloorEntity",
    },
    {
        name: "收银台C",
        image: "models/thumbnails/收银台C.png",
        url: "models/gltf/收银台C.glb",
        type: "FloorEntity",
    },
    /*
{
  "name" : "",
  "image" : "",
  "url" : "",
  "type" : "1"
},
*/
];

export class Entities {
    constructor() {
        this.init();
    }

    createItem(item) {
        return `
        <div class="col-sm-4">
            <a class="thumbnail add-entity"
                entity-name="${item.name}"
                entity-url="${item.url}"
                entity-type="${item.type}">
                <img alt="Add Entity" src="${item.image}" />
                ${item.name}
            </a>
        </div>
      `;
    }

    init() {
        var container = $("#entitiesDiv");

        const items = entities;
        for (var i = 0; i < items.length; i++) {
            const html = this.createItem(items[i]);
            container.append(html);
        }
    }
}
