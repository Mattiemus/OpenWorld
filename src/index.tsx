import "reflect-metadata";

import './index.css';
import { World } from './openworld/engine/datamodel/services/world/world';
import { OpenWorld } from "./shared/datamodel/core/openworld";
import { initialiseServiceLocator } from './shared/datamodel/internals/service-locator';
import { WorldRenderSystemImpl } from './openworld/engine/datamodel/services/world/impl/world-render-system-impl';
import { BrowserThreeJsWorldRenderSystem } from "./client/systems/rendering/browser-threejs-world-render-system";
import { ClientReplicator } from './shared/datamodel/networking/client-replicator';
import { Primitive, PrimitiveType } from './shared/datamodel/building/primitive';
import { Mouse } from "./openworld/engine/datamodel/services/input/mouse";
import { RunService } from "./openworld/engine/datamodel/services/scheduling/run-service";
import { TaskSchedulerImpl } from './openworld/engine/datamodel/services/scheduling/impl/task-scheduler-impl';
import { BrowserTaskScheduler } from './client/systems/task-scheduler/browser-task-scheduler';
import { MouseInputImpl } from './openworld/engine/datamodel/services/input/impl/mouse-input-impl';
import { BrowserMouseInput } from './client/systems/input/browser-mouse-input';

import * as THREE from 'three';

function RunOpenworld(func: (openworld: OpenWorld, world: World) => void): void {
    initialiseServiceLocator(c => {
        c.bind(WorldRenderSystemImpl).to(BrowserThreeJsWorldRenderSystem).inSingletonScope();
        c.bind(TaskSchedulerImpl).to(BrowserTaskScheduler).inSingletonScope();
        c.bind(MouseInputImpl).to(BrowserMouseInput).inSingletonScope();
    });

    const openworld = new OpenWorld();
    openworld.getService(ClientReplicator);
    openworld.getService(Mouse);
    openworld.getService(RunService);

    const world = openworld.getService(World);
    
    func(openworld, world);    
} 

RunOpenworld((openworld, world) => {
    // Create some shapes to look at (as these are created on the client they are local only)
    const cubeSize = 9 / 2;
    for (let x = -cubeSize; x <= cubeSize; x++) {
        for (let y = -cubeSize; y <= cubeSize; y++) {
            for (let z = -cubeSize; z <= cubeSize; z++) {          
                const p = new Primitive();
                p.type = Math.random() > 0.5 ? PrimitiveType.Sphere : PrimitiveType.Cube;
                p.position.set(x * 1.1, y * 1.1, z * 1.1);
                p.parent = world;
            }
        }
    }

    // Basic orbit camera controller
    let mouseSensitivity = new THREE.Vector2(1.0, 1.0);
    let radius = 8.0;
    let radiusMin = 1.0;
    let radiusMax = 30.0;
    let theta = 0.0;
    let phi = 0.0;
    let phiMin = -85;
    let phiMax = 85;
    const camTarget = new THREE.Vector3(0, 0, 0);

    function calculateOrbitVector()
    {
        const deg2rad = (Math.PI / 180);

        return new THREE.Vector3(
            Math.sin(theta * deg2rad) * Math.cos(phi * deg2rad),
            Math.sin(phi * deg2rad),
            Math.cos(theta * deg2rad) * Math.cos(phi * deg2rad));
    }

    const mouse = openworld.getService(Mouse);
    const runService = openworld.getService(RunService);

    mouse.wheelDown.connect(() => {
        radius += 1.0;
        radius = Math.min(Math.max(radius, radiusMin), radiusMax);
    });
    
    mouse.wheelUp.connect(() => {        
        radius -= 1.0;
        radius = Math.min(Math.max(radius, radiusMin), radiusMax);
    });

    mouse.move.connect((deltaX, deltaY) => {
        if (!mouse.isRightButtonDown) {
            return;
        }

        theta -= deltaX * (mouseSensitivity.x / 2.0);
        theta %= 360;

        phi += deltaY * (mouseSensitivity.y / 2.0);
        phi = Math.min(Math.max(phi, phiMin), phiMax);
    });

    runService.preSimulation.connect(() => {
        const orbitVector = calculateOrbitVector();
        orbitVector.multiplyScalar(radius);
        orbitVector.add(camTarget);

        world.currentCamera.position = orbitVector;

        world.currentCamera['_camera'].lookAt(camTarget);
    });
});
