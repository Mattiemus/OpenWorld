import "reflect-metadata";

import "./index.css"

import * as React from "react";
import { render } from "react-dom";
import DataModel from "./openworld/engine/datamodel/elements/datamodel";
import World from "./openworld/engine/datamodel/services/world";
import RunServiceImpl from "./openworld/engine/services/run-service-impl";
import BrowserRunServiceImpl from "./openworld/client/services/browser/browser-run-service-impl";
import BrowserMouseImpl from "./openworld/client/services/browser/browser-mouse-impl";
import ClientReplicatorImpl from "./openworld/engine/services/client-replicator-impl";
import BrowserClientReplicatorImpl from "./openworld/client/services/browser/browser-client-replicator-impl";
import ClientReplicator from "./openworld/engine/datamodel/services/client-replicator";
import Mouse from "./openworld/engine/datamodel/services/mouse";
import RunService from "./openworld/engine/datamodel/services/run-service";
import Camera from "./openworld/engine/datamodel/elements/camera";
import Primitive, { PrimitiveType } from "./openworld/engine/datamodel/elements/primitive";
import CFrame from "./openworld/engine/math/cframe";
import Vector3 from "./openworld/engine/math/vector3";
import Vector2 from "./openworld/engine/math/vector2";
import MathEx from "./openworld/engine/math/mathex";
import RenderCanvas from './openworld/client/services/browser/graphics/render-canvas';
import Instance from "./openworld/engine/datamodel/elements/instance";
import ServiceBase from './openworld/engine/services/base/service-base';
import { Class } from "./openworld/engine/utils/types";
import MouseImpl from './openworld/engine/services/mouse-impl';
import BrowserWorldImpl from './openworld/client/services/browser/browser-world-impl';
import WorldImpl from "./openworld/engine/services/world-impl";
import BrowserLightingImpl from './openworld/client/services/browser/browser-lighting-impl';
import LightingImpl from './openworld/engine/services/lighting-impl';
import Lighting from "./openworld/engine/datamodel/services/lighting";
import Color3 from "./openworld/engine/math/color3";
import PointLight from './openworld/engine/datamodel/elements/point-light';

function createLocalDataModel(canvas: HTMLCanvasElement): DataModel {
    // TODO: Remove canvas paremter so we can create a local data model anywhere, and retarget the canvas later on

    const datamodel = new DataModel();

    const renderCanvas = new RenderCanvas(canvas);
    const browserMouseService = new BrowserMouseImpl();
    const browserTaskScheduler = new BrowserRunServiceImpl(renderCanvas);
    const browserClientReplicator = new BrowserClientReplicatorImpl(datamodel);
    const browserWorldImpl = new BrowserWorldImpl(renderCanvas);
    const browserLightingImpl = new BrowserLightingImpl(renderCanvas);

    Instance['_getServiceImpl'] = ((serviceBase: Class<ServiceBase>): ServiceBase => {
        if (serviceBase === MouseImpl) {
            return browserMouseService;
        } else if (serviceBase === RunServiceImpl) {
            return browserTaskScheduler;
        } else if (serviceBase === ClientReplicatorImpl) {
            return browserClientReplicator;
        } else if (serviceBase === WorldImpl) {
            return browserWorldImpl;
        } else if (serviceBase === LightingImpl) {
            return browserLightingImpl;
        }

        throw new Error('Cannot find service implementation');
    }) as any;

    const world = datamodel.getService(World);
    world.currentCamera = new Camera();

    const lighting = datamodel.getService(Lighting);
    lighting.ambient = new Color3(0.25, 0.25, 0.25);

    datamodel.getService(ClientReplicator);
    datamodel.getService(Mouse);
    datamodel.getService(RunService);       

    return datamodel;
}

export class OpenWorldCanvas extends React.Component
{    
    private _canvas: HTMLCanvasElement | null = null;

    public componentDidMount(): void {

        if (this._canvas === null) {
            throw new Error('Canvas should not be null in this context!');
        }

        const datamodel = createLocalDataModel(this._canvas);
        const world = datamodel.getService(World);

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

        // Create a test spot light
        const pointLight = new PointLight();
        pointLight.cframe = CFrame.fromPosition(new Vector3(0, (cubeSize * 1.1) + 1.1, 0));
        pointLight.parent = world;
            
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

            const worldChildren = world.getChildren();
            while (true) {
                const idx = Math.floor(Math.random() * worldChildren.length);                    
                const child = worldChildren[idx];

                if (child instanceof Primitive) {
                    if (child.type === PrimitiveType.Cube) {
                        child.type = PrimitiveType.Sphere
                    } else {
                        child.type = PrimitiveType.Cube;
                    }

                    break;
                }
            }
        });
    }

    public render() {
        return (
            <canvas
                ref={el => { this._canvas = el; }}
            />
        );
    }
}

render(
    <OpenWorldCanvas />,   
    document.body
);