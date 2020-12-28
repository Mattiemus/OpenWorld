import "reflect-metadata";

import './index.css';
import { World } from './openworld/engine/datamodel/services/world/world';
import { DataModel } from "./openworld/engine/datamodel/elements/core/datamodel";
import { installServices } from './openworld/engine/datamodel/internals/services/service-locator';
import { WorldRenderSystemImpl } from './openworld/engine/datamodel/services/world/impl/world-render-system-impl';
import { BrowserThreeJsWorldRenderSystem } from "./client/systems/rendering/browser-threejs-world-render-system";
import { ClientReplicator } from './openworld/engine/datamodel/services/networking/client-replicator';
import { Primitive, PrimitiveType } from './openworld/engine/datamodel/elements/building/primitive';
import { Mouse } from "./openworld/engine/datamodel/services/input/mouse";
import { RunService } from "./openworld/engine/datamodel/services/scheduling/run-service";
import { TaskSchedulerImpl } from './openworld/engine/datamodel/services/scheduling/impl/task-scheduler-impl';
import { BrowserTaskScheduler } from './client/systems/task-scheduler/browser-task-scheduler';
import { MouseInputImpl } from './openworld/engine/datamodel/services/input/impl/mouse-input-impl';
import { BrowserMouseInput } from './client/systems/input/browser-mouse-input';
import { WorldPhysicsSystemImpl } from './openworld/engine/datamodel/services/world/impl/world-physics-system-impl';
import { BrowserCannonJsWorldPhysicsSystem } from './client/systems/physics/browser-cannonjs-world-physics-system';
import { ClientReplicatorImpl } from './openworld/engine/datamodel/services/networking/impl/client-replicator-impl';
import { BrowserClientReplicator } from './client/systems/networking/browser-client-replicator';
import { MathEx } from "./openworld/engine/math/mathex";
import { CFrame } from "./openworld/engine/math/cframe";
import { Vector3 } from './openworld/engine/math/vector3';
import { Vector2 } from "./openworld/engine/math/vector2";
import { serviceInstanceBinding, ServiceInstance } from './openworld/engine/datamodel/internals/services/service-instance';
import { Camera } from "./openworld/engine/datamodel/elements/world/camera";



// TODO: Is this the best way to do services....

function RunOpenworld(func: (datamodel: DataModel, world: World) => void): void {
    const datamodel = new DataModel();

    installServices(c => {
        c.bind(WorldRenderSystemImpl).to(BrowserThreeJsWorldRenderSystem).inSingletonScope();
        c.bind(WorldPhysicsSystemImpl).to(BrowserCannonJsWorldPhysicsSystem).inSingletonScope();
        c.bind(TaskSchedulerImpl).to(BrowserTaskScheduler).inSingletonScope();
        c.bind(MouseInputImpl).to(BrowserMouseInput).inSingletonScope();
        c.bind(ClientReplicatorImpl).to(BrowserClientReplicator).inSingletonScope();

        c.bind(serviceInstanceBinding(datamodel)).toConstantValue(new ServiceInstance(datamodel));
    });

    const world = datamodel.getService(World);
    
    datamodel.getService(ClientReplicator);
    datamodel.getService(Mouse);
    datamodel.getService(RunService);

    


    const cam = new Camera();
    cam.parent = world;

    world.currentCamera = cam;


    func(datamodel, world);    
} 

RunOpenworld((datamodel, world) => {
    // Create some shapes to look at (as these are created on the client they are local only)
    const cubeSize = 9 / 2;
    for (let x = -cubeSize; x <= cubeSize; x++) {
        for (let y = -cubeSize; y <= cubeSize; y++) {
            for (let z = -cubeSize; z <= cubeSize; z++) {          
                const p = new Primitive();
                p.type = Math.random() > 0.5 ? PrimitiveType.Sphere : PrimitiveType.Cube;
                p.cframe = CFrame.fromPosition(new Vector3(x * 1.1, y * 1.1, z * 1.1));
                p.parent = world;
            }
        }
    }

    // Basic orbit camera controller
    let mouseSensitivity = new Vector2(1, 1);
    let radius = 8.0;
    let radiusMin = 1.0;
    let radiusMax = 30.0;
    let theta = 0.0;
    let phi = 0.0;
    let phiMin = -85;
    let phiMax = 85;
    const camTarget = new Vector3(0, 0, 0);

    function calculateOrbitVector()
    {
        return new Vector3(
            Math.sin(theta * MathEx.deg2rad) * Math.cos(phi * MathEx.deg2rad),
            Math.sin(phi * MathEx.deg2rad),
            Math.cos(theta * MathEx.deg2rad) * Math.cos(phi * MathEx.deg2rad));
    }

    const mouse = datamodel.getService(Mouse);
    const runService = datamodel.getService(RunService);

    mouse.wheelDown.connect(() => {
        radius += 1.0;
        radius = MathEx.clamp(radius, radiusMin, radiusMax);
    });
    
    mouse.wheelUp.connect(() => {        
        radius -= 1.0;
        radius = MathEx.clamp(radius, radiusMin, radiusMax);
    });

    mouse.move.connect((deltaX, deltaY) => {
        if (!mouse.isRightButtonDown) {
            return;
        }

        theta -= deltaX * (mouseSensitivity.x / 2.0);
        theta %= 360;

        phi += deltaY * (mouseSensitivity.y / 2.0);
        phi = MathEx.clamp(phi, phiMin, phiMax);
    });

    runService.preSimulation.connect(() => {
        for (let i = 0; i < 1000; i++) {
            let cameraPosition = calculateOrbitVector();
            cameraPosition = Vector3.multiplyScalar(cameraPosition, radius);
            cameraPosition = Vector3.add(cameraPosition, camTarget);
            
            world.currentCamera!.cframe = CFrame.createLookAt(cameraPosition, camTarget);
        }
    });
});
