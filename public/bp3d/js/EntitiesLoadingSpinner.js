export class EntitiesLoadingSpinner {
    entitiesLoading = 0;

    constructor(viewer3d) {
        const sceneMgr = viewer3d.model.sceneManager;
        this.init(sceneMgr);
    }

    setActiveEntity(active) {
        this.update();
    }

    update() {
        if (this.entitiesLoading > 0) {
            $("#loading-modal").show();
        } else {
            $("#loading-modal").hide();
        }
    }

    init(sceneMgr) {
        sceneMgr.entityLoadingCallbacks.add(() => {
            this.entitiesLoading += 1;
            this.update();
        });

        sceneMgr.entityLoadedCallbacks.add(() => {
            this.entitiesLoading -= 1;
            this.update();
        });

        sceneMgr.entityLoadFailedCallbacks.add(() => {
            this.entitiesLoading -= 1;
            this.update();
        });
        this.update();
    }
}
