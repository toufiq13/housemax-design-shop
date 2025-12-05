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