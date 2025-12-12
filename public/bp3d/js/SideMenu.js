export class SideMenu {
    ACTIVE_CLASS = "active";
    tabs = {
        FLOORPLAN: $("#floorplan_tab"),
        DESIGN: $("#design_tab"),
        SHOP: $("#entities_tab"),
    };

    constructor(viewer3d, viewer2d) {
        this.viewer3d = viewer3d;
        this.viewer2d = viewer2d;
        this.stateChangeCallbacks = $.Callbacks();
        this.states = {
            DEFAULT: {
                div: $("#viewer3d"), // TODO: passin div as arguments
                tab: this.tabs.DESIGN,
            },
            FLOORPLAN: {
                div: $("#viewer2d"), // TODO: passin div as arguments
                tab: this.tabs.FLOORPLAN,
            },
            SHOP: {
                div: $("#add-entities"),
                tab: this.tabs.SHOP,
            },
        };
        // sidebar state
        this.currentState = this.states.FLOORPLAN;
        this.init();
    }

    init() {
        for (var tab in this.tabs) {
            var elem = this.tabs[tab];
            elem.click(this.tabClicked(elem));
        }

        $("#update-floorplan").click(this.floorplanUpdate.bind(this));

        this.initLeftMenu();

        this.viewer3d.updateWindowSize();
        this.handleWindowResize();

        this.initEntities();

        this.setCurrentState(this.states.DEFAULT);
    }

    floorplanUpdate() {
        this.setCurrentState(this.states.DEFAULT);
    }

    tabClicked(tab) {
        return () => {
            // Stop three from spinning
            this.viewer3d.stopSpin();

            // Selected a new tab
            for (var key in this.states) {
                var state = this.states[key];
                if (state.tab == tab) {
                    this.setCurrentState(state);
                    break;
                }
            }
        };
    }

    setCurrentState(newState) {
        if (this.currentState == newState) {
            return;
        }

        // show the right tab as active
        if (this.currentState.tab !== newState.tab) {
            if (this.currentState.tab != null) {
                this.currentState.tab.removeClass(this.ACTIVE_CLASS);
            }
            if (newState.tab != null) {
                newState.tab.addClass(this.ACTIVE_CLASS);
            }
        }

        // set entity unselected
        this.viewer3d.setSelectedEntity(null);

        // show and hide the right divs
        this.currentState.div.hide();
        newState.div.show();

        // custom actions
        if (newState == this.states.FLOORPLAN) {
            this.viewer2d.reset();
        }

        if (this.currentState == this.states.FLOORPLAN) {
            this.viewer3d.model.floorplan.update();
        }

        if (newState == this.states.DEFAULT) {
            this.viewer3d.updateWindowSize();
        }

        // set new state
        this.handleWindowResize();
        this.currentState = newState;

        this.stateChangeCallbacks.fire(newState);
    }

    initLeftMenu() {
        $(window).resize(this.handleWindowResize);
        this.handleWindowResize();
    }

    handleWindowResize() {
        $(".sidebar").height(window.innerHeight);
        $("#add-entities").height(window.innerHeight);
    }

    // TODO: this doesn't really belong here
    initEntities() {
        $("#add-entities")
            .find(".add-entity")
            .mouseup((e) => {
                // only handle left mouse button event
                if (e.button !== 0) {
                    return;
                }
                const entityName = $(e.currentTarget).attr("entity-name");
                const entityType = $(e.currentTarget).attr("entity-type");
                const entityUrl = $(e.currentTarget).attr("entity-url");
                const entityWidth = $(e.currentTarget).attr("entity-width");
                const entityDepth = $(e.currentTarget).attr("entity-depth");
                const entityHeight = $(e.currentTarget).attr("entity-height");
                const entityScale = $(e.currentTarget).attr("entity-scale");

                const entityConfig = {
                    name: entityName,
                    type: entityType,
                    url: entityUrl,
                    resizable: true,
                };

                // Add dimensions if specified (values are in meters)
                if (entityWidth) entityConfig.width = parseFloat(entityWidth);
                if (entityDepth) entityConfig.depth = parseFloat(entityDepth);
                if (entityHeight) entityConfig.height = parseFloat(entityHeight);
                if (entityScale) entityConfig.scale = parseFloat(entityScale);

                this.viewer3d.addEntity(entityConfig);
                this.setCurrentState(this.states.DEFAULT);
            });
    }
}
