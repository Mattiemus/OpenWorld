import * as THREE from 'three';
import RenderCanvas from '../../../client-shared/services/graphics/render-canvas';
import { IDestroyable } from '../../../engine/utils/interfaces';
import { SignalConnection } from 'typed-signals';
import MathEx from '../../../engine/math/mathex';
import RunServiceImpl from '../../../engine/datamodel/services/impl/run-service-impl';

export default class EditorCamera extends THREE.PerspectiveCamera implements IDestroyable {
    private _mouseX = 0;
    private _mouseY = 0;
    private _phi = -90;
    private _theta = 0;
    private _moveSpeed = 15;
    private _fastMoveSpeed = 50;
    private _lookMoveSpeed = 1 / 5;
    private _isRightMouseDown = false;    
    private _rapidMovement = false;
    private _moveForward = false;
    private _moveBackward = false;
    private _moveLeft = false;
    private _moveRight = false;
    private _moveUp = false;
    private _moveDown = false;
    private _tempVector3 = new THREE.Vector3();

    private _renderCanvasResizeConnection: SignalConnection;
    private _renderCanvasCanvasChangedConnection: SignalConnection;
    private _runServicePreSimulationConnection: SignalConnection;
    
    //
    // Constructor
    //

    constructor(
        private _renderCanvas: RenderCanvas,
        runService: RunServiceImpl
    ) {
        super();        
        
        this._renderCanvasResizeConnection =
            _renderCanvas.resized.connect(this.onRenderCanvasResized.bind(this));
        
        this._renderCanvasCanvasChangedConnection =
            _renderCanvas.canvasChanged.connect(this.onRenderCanvasChanged.bind(this));

        this._runServicePreSimulationConnection =
            runService.preSimulation.connect(this.onPreSimulation.bind(this));
    }

    //
    // Methods
    //

    public destroy(): void {
        if (this.parent !== null) {
            this.parent.remove(this);
        }

        if (this._renderCanvas.canvas !== null) {
            this.disconnectCanvasMouseEvents(this._renderCanvas.canvas);
        }

        this._renderCanvasResizeConnection.disconnect();
        this._renderCanvasCanvasChangedConnection.disconnect();
        this._runServicePreSimulationConnection.disconnect();
    }

    private onRenderCanvasResized(): void {
        this.aspect = this._renderCanvas.width / this._renderCanvas.height;
        this.updateProjectionMatrix();
    }

    private onRenderCanvasChanged(
        oldCanvas: HTMLCanvasElement | null, 
        newCanvas: HTMLCanvasElement | null
    ): void {
        if (oldCanvas !== null) {
            this.disconnectCanvasMouseEvents(oldCanvas);
        }

        if (newCanvas !== null) {
            this.connectCanvasMouseEvents(newCanvas);
        }
    }

    private connectCanvasMouseEvents(canvas: HTMLCanvasElement): void {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('mouseup', this.onMouseUp);
        canvas.addEventListener('mousemove', this.onMouseMove);
        canvas.addEventListener('wheel', this.onMouseWheel);
    }

    private disconnectCanvasMouseEvents(canvas: HTMLCanvasElement): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);

        canvas.removeEventListener('mousedown', this.onMouseDown);
        canvas.removeEventListener('mouseup', this.onMouseUp);
        canvas.removeEventListener('mousemove', this.onMouseMove);
        canvas.removeEventListener('wheel', this.onMouseWheel);
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        switch (e.code) {
            case 'ShiftLeft':
                this._rapidMovement = true;
                break;

			case 'ArrowUp':
            case 'KeyW': 
                this._moveForward = true;
                break;

			case 'ArrowLeft':
			case 'KeyA':
                this._moveLeft = true;
                break;

			case 'ArrowDown':
			case 'KeyS':
                this._moveBackward = true;
                break;

			case 'ArrowRight':
			case 'KeyD':
                this._moveRight = true;
                break;

			case 'KeyR':
                this._moveUp = true;
                break;

			case 'KeyF':
                this._moveDown = true;
                break;
		}
    }

    private onKeyUp = (e: KeyboardEvent): void => {        
        switch (e.code) {
            case 'ShiftLeft':
                this._rapidMovement = false;
                break;

			case 'ArrowUp':
            case 'KeyW': 
                this._moveForward = false;
                break;

			case 'ArrowLeft':
			case 'KeyA':
                this._moveLeft = false;
                break;

			case 'ArrowDown':
			case 'KeyS':
                this._moveBackward = false;
                break;

			case 'ArrowRight':
			case 'KeyD':
                this._moveRight = false;
                break;

			case 'KeyR':
                this._moveUp = false;
                break;

			case 'KeyF':
                this._moveDown = false;
                break;
		}
    }

    private onMouseDown = (e: MouseEvent): void => {
        if (e.button === 2) {
            this._isRightMouseDown = true;
        }
    }

    private onMouseUp = (e: MouseEvent): void => {
        if (e.button === 2) {
            this._isRightMouseDown = false;
        }
    }

    private onMouseMove = (e: MouseEvent): void => {        
        const deltaX = e.clientX - this._mouseX;
        const deltaY = e.clientY - this._mouseY;

        this._mouseX = e.clientX;
        this._mouseY = e.clientY;

        if (this._isRightMouseDown) {
            this._theta -= deltaX * this._lookMoveSpeed;
    
            this._phi += -deltaY * this._lookMoveSpeed;
            this._phi = MathEx.clamp(this._phi, -179, -1);

            this._tempVector3.setFromSphericalCoords(1, this._phi * MathEx.deg2rad, this._theta * MathEx.deg2rad);
            this._tempVector3.add(this.position);

            this.lookAt(this._tempVector3);
        }
    }

    private onMouseWheel = (e: WheelEvent): void => {
        this.translateZ(e.deltaY / 250);
    }

    private onPreSimulation(deltaTime: number, _elapsedTime: number): void {        
        let actualMoveSpeed =
            deltaTime * (this._rapidMovement ? this._fastMoveSpeed : this._moveSpeed);
        
        if (this._moveForward) {
            this.translateZ(-actualMoveSpeed);
        }

        if (this._moveBackward) {
            this.translateZ(actualMoveSpeed);
        }

        if (this._moveLeft) {
            this.translateX(-actualMoveSpeed);
        }

        if (this._moveRight) {
            this.translateX(actualMoveSpeed);
        }

        if (this._moveUp) {
            this.translateY(actualMoveSpeed);
        }

        if (this._moveDown) {
            this.translateY(-actualMoveSpeed);
        }
    }
} 