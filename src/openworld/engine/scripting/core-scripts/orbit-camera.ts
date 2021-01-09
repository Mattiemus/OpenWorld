import Vector2 from "../../math/vector2";
import Vector3 from "../../math/vector3";
import MathEx from "../../math/mathex";
import InstanceContext from '../../datamodel/internals/instance-context';
import Mouse from "../../datamodel/services/mouse";
import RunService from "../../datamodel/services/run-service";
import World from "../../datamodel/services/world";
import CFrame from "../../math/cframe";
import ScriptWrapper from "../script-wrapper";

export default class OrbitCameraCoreScript extends ScriptWrapper
{
    //
    // Constructor
    //

    constructor(private _context: InstanceContext) {
        super();
    }

    //
    // Methods
    //

    protected onRun(): void {
        const dataModel = this._context.dataModel;

        let mouseSensitivity = new Vector2(1, 1);
        let radius = 8.0;
        let radiusMin = 1.0;
        let radiusMax = 30.0;
        let theta = 0.0;
        let phi = 0.0;
        let phiMin = -85;
        let phiMax = 85;
        const camTarget = new Vector3(0, 0, 0);
    
        const world = dataModel.getService(World);
        const mouse = dataModel.getService(Mouse);
        const runService = dataModel.getService(RunService);
    
        this.addSignalConnection(
            mouse.wheelDown.connect(() => {
                radius += 1.0;
                radius = MathEx.clamp(radius, radiusMin, radiusMax);
            }));
        
        this.addSignalConnection(
            mouse.wheelUp.connect(() => {        
                radius -= 1.0;
                radius = MathEx.clamp(radius, radiusMin, radiusMax);
            }));
    
        this.addSignalConnection(
            mouse.move.connect((deltaX, deltaY) => {
                if (!mouse.isRightButtonDown) {
                    return;
                }
        
                theta -= deltaX * (mouseSensitivity.x / 2.0);
                theta %= 360;
        
                phi += deltaY * (mouseSensitivity.y / 2.0);
                phi = MathEx.clamp(phi, phiMin, phiMax);
            }));
    
        this.addSignalConnection(
            runService.preSimulation.connect(() => {
                if (world.currentCamera === null) {
                    return;
                }
        
                let cameraPosition =
                    new Vector3(
                        Math.sin(theta * MathEx.deg2rad) * Math.cos(phi * MathEx.deg2rad),
                        Math.sin(phi * MathEx.deg2rad),
                        Math.cos(theta * MathEx.deg2rad) * Math.cos(phi * MathEx.deg2rad));
        
                cameraPosition = Vector3.multiplyScalar(cameraPosition, radius);
                cameraPosition = Vector3.add(cameraPosition, camTarget);
                        
                world.currentCamera.cframe = CFrame.createLookAt(cameraPosition, camTarget);
            }));
    }
}
