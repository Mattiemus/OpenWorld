import * as THREE from 'three';
import EditorCamera from './editor-camera';
import Instance from '../../../engine/datamodel/elements/instance';
import RenderCanvas from '../../../client-shared/services/graphics/render-canvas';
import { BehaviorSubject, Observable } from 'rxjs';
import { SignalConnection } from 'typed-signals';
import { hasFieldOfType } from '../../../engine/utils/type-guards';
import Destroyable from '../../../engine/utils/destroyable';
import SkyProxy from '../../../client-shared/services/graphics/proxies/sky-proxy';

export default class EditorRaycaster extends Destroyable {    
    private _raycaster = new THREE.Raycaster();
    private _mousePosition = new THREE.Vector2();

    private _hoverInstance$ = new BehaviorSubject<Instance | undefined>(undefined);
    
    private _renderCanvasCanvasChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(
        private _editorCamera: EditorCamera,
        private _renderCanvas: RenderCanvas
    ) {
        super();

        this._renderCanvasCanvasChangedConnection =
            _renderCanvas.canvasChanged.connect(this.onRenderCanvasChanged.bind(this));  
    }

    //
    // Properties
    //

    public get hoverInstance(): Instance | undefined {
        this.throwIfDestroyed();
        return this._hoverInstance$.value;
    }
    public get hoverInstance$(): Observable<Instance | undefined> {
        this.throwIfDestroyed();
        return this._hoverInstance$.asObservable();
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        if (this._renderCanvas.canvas !== null) {
            this.disconnectCanvasMouseEvents(this._renderCanvas.canvas);
        }

        this._renderCanvasCanvasChangedConnection.disconnect();
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
        canvas.addEventListener('mousemove', this.onMouseMove);
    }

    private disconnectCanvasMouseEvents(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.onMouseMove);
    }

    private onMouseMove = (e: MouseEvent): void => {
        var rect = this._renderCanvas.canvas!.getBoundingClientRect();
        this._mousePosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1; 
        this._mousePosition.y = ((e.clientY - rect.top) / rect.height) * 2 - 1; 

        this._raycaster.setFromCamera(this._mousePosition, this._editorCamera);

        let intersections = this._raycaster.intersectObjects(this._renderCanvas.scene.children, true);

        if (intersections.length > 1) {
            intersections = intersections.filter(i => !(i.object instanceof SkyProxy));
        }

        if (intersections.length !== 0) {            
            const closestIntersection = intersections[0];
            const closestObject = this.determineInstanceFromSceneObject(closestIntersection.object);

            if (this._hoverInstance$.value !== closestObject) {
                //this._hoverInstance$.next(closestObject);
            }

        } else {            
            if (this._hoverInstance$.value !== undefined) {
                //this._hoverInstance$.next(undefined);
            }
        }
    }

    private determineInstanceFromSceneObject(sceneObject: THREE.Object3D): Instance | undefined {
        if (hasFieldOfType('dataModel', sceneObject, (f: unknown): f is Instance => f instanceof Instance)) {
            return sceneObject.dataModel;
        }

        return undefined;
    }
}