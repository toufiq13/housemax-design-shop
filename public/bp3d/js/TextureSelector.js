export class TextureSelector {
    currentTarget = null;

    constructor(viewer3d, sideMenu) {
        this.viewer3d = viewer3d;
        this.sideMenu = sideMenu;
        this.init();
    }

    initTextureSelectors() {
        const scope = this;
        $(".texture-select-thumbnail").click(function (e) {
            if (scope.currentTarget == null) {
                return;
            }
            const textureUrl = $(this).attr("texture-url");
            const textureAutoScale = $(this).attr("texture-autoRepeat") === "true";
            const textureScale = parseInt($(this).attr("texture-scale"));
            const textureConfig = {
                url: textureUrl,
                repeat: {
                    autoCalculateRepeat: textureAutoScale,
                    uvScale: textureScale,
                },
            };

            if (scope.currentTarget) {
                scope.currentTarget.setMaterialConfig({ texture: textureConfig });
            }

            e.preventDefault();
        });
    }

    init() {
        this.viewer3d.wallClicked.add(this.wallClicked.bind(this));
        this.viewer3d.floorClicked.add(this.floorClicked.bind(this));
        this.viewer3d.entitySelectedCallbacks.add(this.reset.bind(this));
        this.viewer3d.nothingClicked.add(this.reset.bind(this));
        this.sideMenu.stateChangeCallbacks.add(this.reset.bind(this));
        this.initTextureSelectors();
    }

    wallClicked(halfEdge) {
        this.currentTarget = halfEdge;
        $("#floorTexturesDiv").hide();
        $("#wallTexturesDiv").show();
    }

    floorClicked(room) {
        this.currentTarget = room;
        $("#wallTexturesDiv").hide();
        $("#floorTexturesDiv").show();
    }

    reset() {
        this.currentTarget = null;
        $("#wallTexturesDiv").hide();
        $("#floorTexturesDiv").hide();
    }
}
