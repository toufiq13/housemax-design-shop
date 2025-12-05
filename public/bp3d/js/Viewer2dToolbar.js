import { FloorplannerMode } from "@bp3d/core";

export class Viewer2dToolbar {
    // buttons
    move = "#move";
    remove = "#delete";
    draw = "#draw";

    activeStlye = "btn-primary disabled";

    constructor(viewer2d) {
        this.viewer2d = viewer2d;
        this.init();
    }

    init() {
        const move = this.move;
        const remove = this.remove;
        const draw = this.draw;
        const activeStlye = this.activeStlye;

        $(window).resize(() => this.viewer2d.resizeView());
        this.viewer2d.resizeView();

        // mode buttons
        this.viewer2d.modeResetCallbacks.add((mode) => {
            $(draw).removeClass(activeStlye);
            $(remove).removeClass(activeStlye);
            $(move).removeClass(activeStlye);
            if (mode === FloorplannerMode.Move) {
                $(move).addClass(activeStlye);
            } else if (mode === FloorplannerMode.Draw) {
                $(draw).addClass(activeStlye);
            } else if (mode === FloorplannerMode.Delete) {
                $(remove).addClass(activeStlye);
            }

            if (mode === FloorplannerMode.Draw) {
                $("#draw-walls-hint").show();
                // this.handleWindowResize();
                this.viewer2d.resizeView();
            } else {
                $("#draw-walls-hint").hide();
            }
        });

        $(move).click(() => {
            this.viewer2d.setMode(FloorplannerMode.Move);
        });

        $(draw).click(() => {
            this.viewer2d.setMode(FloorplannerMode.Draw);
        });

        $(remove).click(() => {
            this.viewer2d.setMode(FloorplannerMode.Delete);
        });
    }
}
