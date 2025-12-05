export class ContextMenu {
    selectedEntity = null;
    DisplayUnitToMeterFactor = 100; // display unit is cm

    constructor(viewer3d) {
        this.viewer3d = viewer3d;
        this.init();
        $("#context-menu").hide();
    }

    init() {
        $("#context-menu-delete").click((event) => {
            if (this.selectedEntity) {
                this.viewer3d.removeEntity(this.selectedEntity);
            }
        });

        this.viewer3d.entitySelectedCallbacks.add(this.entitySelected.bind(this));
        this.viewer3d.entityUnselectedCallbacks.add(this.entityUnselected.bind(this));

        this.initResize();

        $("#fixed").click(() => {
            if (this.selectedEntity) {
                const checked = $("#fixed").prop("checked");
                this.selectedEntity.setFixed(checked);
            }
        });
    }

    entitySelected(entity) {
        this.selectedEntity = entity;
        if (!this.selectedEntity) {
            return;
        }

        $("#context-menu-name").text(entity.metadata.entityName);

        const entityWidthElement = $("#entity-width");
        const entityHeightElement = $("#entity-height");
        const entityDepthElement = $("#entity-depth");
        // do unit conversion and handle number of digites
        const toDisplay = (valInMeter) => {
            return (valInMeter * this.DisplayUnitToMeterFactor).toFixed(1);
        };
        entityWidthElement.val(toDisplay(this.selectedEntity.getWidth()));
        entityHeightElement.val(toDisplay(this.selectedEntity.getHeight()));
        entityDepthElement.val(toDisplay(this.selectedEntity.getDepth()));

        $("#context-menu").show();
        $("#fixed").prop("checked", entity.fixed);

        const resizable = this.selectedEntity.resizable;
        entityWidthElement.prop("disabled", !resizable);
        entityHeightElement.prop("disabled", !resizable);
        entityDepthElement.prop("disabled", !resizable);
    }

    resize() {
        // selectedEntity.resize(inToCm($("#entity-height").val()), inToCm($("#entity-width").val()), inToCm($("#entity-depth").val()));
        if (!this.selectedEntity) {
            return;
        }
        this.selectedEntity.resize(
            $("#entity-height").val() / this.DisplayUnitToMeterFactor,
            $("#entity-width").val() / this.DisplayUnitToMeterFactor,
            $("#entity-depth").val() / this.DisplayUnitToMeterFactor,
        );
    }

    initResize() {
        $("#entity-height").change(this.resize.bind(this));
        $("#entity-width").change(this.resize.bind(this));
        $("#entity-depth").change(this.resize.bind(this));
    }

    entityUnselected() {
        this.selectedEntity = null;
        $("#context-menu").hide();
    }
}
