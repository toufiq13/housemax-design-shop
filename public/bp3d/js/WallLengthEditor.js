/**
 * WallLengthEditor - Allows users to double-click on walls to edit their length
 */
export class WallLengthEditor {
    constructor(viewer2d, viewer3d) {
        this.viewer2d = viewer2d;
        this.viewer3d = viewer3d;
        this.selectedWall = null;
        this.editPopup = null;
        console.log('[WallLengthEditor] Initializing...');
        this.init();
    }

    init() {
        // Create the edit popup HTML element
        this.createEditPopup();

        // Wait for the canvas to be created, then attach event listener
        this.attachCanvasListener();

        // Also set up a MutationObserver to detect when canvas is added
        this.observeForCanvas();
    }

    attachCanvasListener() {
        const viewer2dContainer = document.getElementById('viewer2d');
        if (!viewer2dContainer) {
            console.log('[WallLengthEditor] viewer2d container not found, retrying...');
            setTimeout(() => this.attachCanvasListener(), 500);
            return;
        }

        const canvas = viewer2dContainer.querySelector('canvas');
        if (canvas) {
            console.log('[WallLengthEditor] Canvas found, attaching double-click listener');
            canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        } else {
            console.log('[WallLengthEditor] Canvas not found yet in viewer2d, will use observer');
        }

        // Also attach to the container as backup
        viewer2dContainer.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    }

    observeForCanvas() {
        const viewer2dContainer = document.getElementById('viewer2d');
        if (!viewer2dContainer) {
            setTimeout(() => this.observeForCanvas(), 500);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'CANVAS') {
                        console.log('[WallLengthEditor] Canvas detected via observer, attaching listener');
                        node.addEventListener('dblclick', this.handleDoubleClick.bind(this));
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        observer.observe(viewer2dContainer, { childList: true, subtree: true });

        // Check if canvas already exists
        const existingCanvas = viewer2dContainer.querySelector('canvas');
        if (existingCanvas) {
            console.log('[WallLengthEditor] Canvas already exists, attaching listener');
            existingCanvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
            observer.disconnect();
        }
    }

    createEditPopup() {
        const popup = document.createElement('div');
        popup.id = 'wall-length-popup';
        popup.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10000;
            background: #ffffff;
            border: 2px solid #428bca;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            min-width: 200px;
        `;

        popup.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #333;">
                Edit Wall Length
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="number" id="wall-length-input" 
                    style="width: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;"
                    placeholder="Length" step="1" min="1">
                <span style="color: #666;">cm</span>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 8px;">
                <button id="wall-length-apply" class="btn btn-primary btn-sm">Apply</button>
                <button id="wall-length-cancel" class="btn btn-default btn-sm">Cancel</button>
            </div>
        `;

        document.body.appendChild(popup);
        this.editPopup = popup;

        // Add event listeners
        document.getElementById('wall-length-apply').addEventListener('click', this.applyLength.bind(this));
        document.getElementById('wall-length-cancel').addEventListener('click', this.hidePopup.bind(this));

        // Handle Enter key
        document.getElementById('wall-length-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.applyLength();
            } else if (e.key === 'Escape') {
                this.hidePopup();
            }
        });

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (this.editPopup.style.display !== 'none' &&
                !this.editPopup.contains(e.target) &&
                !e.target.closest('#viewer2d canvas')) {
                this.hidePopup();
            }
        });

        console.log('[WallLengthEditor] Edit popup created');
    }

    handleDoubleClick(event) {
        console.log('[WallLengthEditor] Double-click detected!', event.target.tagName);

        // Get the floorplan model
        const floorplan = this.viewer3d.model?.floorplan;
        if (!floorplan) {
            console.log('[WallLengthEditor] No floorplan model found');
            return;
        }

        // Get all walls
        const walls = floorplan.getWalls ? floorplan.getWalls() : (floorplan.walls || []);
        console.log('[WallLengthEditor] Number of walls:', walls.length);

        if (!walls || walls.length === 0) {
            console.log('[WallLengthEditor] No walls found');
            return;
        }

        // Get the canvas and calculate the click position
        let canvas = event.target;
        if (canvas.tagName !== 'CANVAS') {
            canvas = document.querySelector('#viewer2d canvas');
            if (!canvas) {
                console.log('[WallLengthEditor] Canvas not found');
                return;
            }
        }

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log('[WallLengthEditor] Click position:', x, y);

        // Convert screen coordinates to floorplan coordinates
        const floorplanView = this.viewer2d.floorplanView || this.viewer2d;
        const scale = floorplanView.scale || this.viewer2d.getScale?.() || 1;
        const originX = floorplanView.originX ?? (floorplanView.getOriginX?.() ?? canvas.width / 2);
        const originY = floorplanView.originY ?? (floorplanView.getOriginY?.() ?? canvas.height / 2);

        const floorX = (x - originX) / scale;
        const floorY = (y - originY) / scale;
        console.log('[WallLengthEditor] Floorplan coords:', floorX, floorY, 'scale:', scale);

        // Find the closest wall to the click
        let closestWall = null;
        let closestDistance = Infinity;

        for (const wall of walls) {
            const start = wall.getStart ? wall.getStart() : wall.start;
            const end = wall.getEnd ? wall.getEnd() : wall.end;

            if (!start || !end) continue;

            const startX = start.x !== undefined ? start.x : (start.getX?.() ?? 0);
            const startY = start.y !== undefined ? start.y : (start.getY?.() ?? 0);
            const endX = end.x !== undefined ? end.x : (end.getX?.() ?? 0);
            const endY = end.y !== undefined ? end.y : (end.getY?.() ?? 0);

            // Calculate distance from point to line segment
            const distance = this.pointToLineDistance(floorX, floorY, startX, startY, endX, endY);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestWall = wall;
            }
        }

        console.log('[WallLengthEditor] Closest wall distance:', closestDistance);

        // Use a generous tolerance
        if (closestWall && closestDistance < 500) {
            console.log('[WallLengthEditor] Wall found, showing popup');
            this.showEditPopup(closestWall, event.clientX, event.clientY);
        } else {
            console.log('[WallLengthEditor] No wall close enough');
        }
    }

    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getWallLength(wall) {
        const start = wall.getStart ? wall.getStart() : wall.start;
        const end = wall.getEnd ? wall.getEnd() : wall.end;

        if (!start || !end) return 0;

        const startX = start.x !== undefined ? start.x : (start.getX?.() ?? 0);
        const startY = start.y !== undefined ? start.y : (start.getY?.() ?? 0);
        const endX = end.x !== undefined ? end.x : (end.getX?.() ?? 0);
        const endY = end.y !== undefined ? end.y : (end.getY?.() ?? 0);

        const dx = endX - startX;
        const dy = endY - startY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    showEditPopup(wall, x, y) {
        this.selectedWall = wall;

        const currentLength = Math.round(this.getWallLength(wall));
        const input = document.getElementById('wall-length-input');
        input.value = currentLength;

        // Position the popup near the click
        this.editPopup.style.left = `${x + 10}px`;
        this.editPopup.style.top = `${y + 10}px`;
        this.editPopup.style.display = 'block';

        // Focus the input
        setTimeout(() => input.focus(), 50);
    }

    hidePopup() {
        this.editPopup.style.display = 'none';
        this.selectedWall = null;
    }

    applyLength() {
        if (!this.selectedWall) {
            this.hidePopup();
            return;
        }

        const input = document.getElementById('wall-length-input');
        const newLength = parseFloat(input.value);

        if (isNaN(newLength) || newLength <= 0) {
            alert('Please enter a valid length greater than 0');
            return;
        }

        // Get current wall endpoints
        const start = this.selectedWall.getStart ? this.selectedWall.getStart() : this.selectedWall.start;
        const end = this.selectedWall.getEnd ? this.selectedWall.getEnd() : this.selectedWall.end;

        if (!start || !end) {
            this.hidePopup();
            return;
        }

        const startX = start.x !== undefined ? start.x : (start.getX?.() ?? 0);
        const startY = start.y !== undefined ? start.y : (start.getY?.() ?? 0);
        const endX = end.x !== undefined ? end.x : (end.getX?.() ?? 0);
        const endY = end.y !== undefined ? end.y : (end.getY?.() ?? 0);

        // Calculate current length and direction
        const dx = endX - startX;
        const dy = endY - startY;
        const currentLength = Math.sqrt(dx * dx + dy * dy);

        if (currentLength === 0) {
            this.hidePopup();
            return;
        }

        // Calculate scale factor
        const scale = newLength / currentLength;

        // Calculate new end position (keeping start fixed)
        const newEndX = startX + dx * scale;
        const newEndY = startY + dy * scale;

        // Update the wall endpoint
        if (end.move) {
            end.move(newEndX, newEndY);
        } else if (end.setX && end.setY) {
            end.setX(newEndX);
            end.setY(newEndY);
        } else if (end.x !== undefined) {
            end.x = newEndX;
            end.y = newEndY;
        }

        // Update the floorplan
        const floorplan = this.viewer3d.model?.floorplan;
        if (floorplan && floorplan.update) {
            floorplan.update();
        }

        // Redraw viewer2d
        if (this.viewer2d.draw) {
            this.viewer2d.draw();
        }

        console.log('[WallLengthEditor] Wall length updated to:', newLength);
        this.hidePopup();
    }
}
