import "reflect-metadata";

import "./index.css"

import * as React from "react";
import { render } from "react-dom";
import DataModel from "./openworld/engine/datamodel/elements/datamodel";
import World from "./openworld/engine/datamodel/services/world";
import Mouse from "./openworld/engine/datamodel/services/mouse";
import RunService from "./openworld/engine/datamodel/services/run-service";
import Camera from "./openworld/engine/datamodel/elements/camera";
import Primitive, { PrimitiveType } from "./openworld/engine/datamodel/elements/primitive";
import CFrame from "./openworld/engine/math/cframe";
import Vector3 from "./openworld/engine/math/vector3";
import Vector2 from "./openworld/engine/math/vector2";
import MathEx from "./openworld/engine/math/mathex";
import Lighting from "./openworld/engine/datamodel/services/lighting";
import Color3 from "./openworld/engine/math/color3";
import PointLight from './openworld/engine/datamodel/elements/point-light';
import Material from "./openworld/engine/datamodel/data-types/material";
import Content from "./openworld/engine/datamodel/data-types/content";
import Sky from './openworld/engine/datamodel/elements/sky';
import ContentProvider from './openworld/engine/datamodel/services/content-provider';
import LocalClientInstanceContext from "./openworld/client/contexts/local-client-instance-context";
import JsonInstanceSerializer from './openworld/engine/datamodel/serialization/json/json-instance-serializer';

export class OpenWorldCanvas extends React.Component
{    
    private _canvas: HTMLCanvasElement | null = null;

    public componentDidMount(): void {
        if (this._canvas === null) {
            throw new Error('Canvas should not be null in this context!');
        }

        const context = new LocalClientInstanceContext(this._canvas);

        const datamodel = new DataModel(context);
    
        const world = datamodel.getService(World);
        world.currentCamera = new Camera(context);
    
        datamodel.getService(ContentProvider);
        datamodel.getService(Lighting);
        //datamodel.getService(ClientReplicator);
        datamodel.getService(Mouse);
        datamodel.getService(RunService);

        // Create some shapes to look at (as these are created on the client they are local only)
        const cubeSize = 5 / 2;
        const topLayerOfPrimities: Primitive[] = [];
        for (let x = -cubeSize; x <= cubeSize; x++) {
            for (let y = -cubeSize; y <= cubeSize; y++) {
                for (let z = -cubeSize; z <= cubeSize; z++) {          
                    const p = new Primitive(context);
                    p.cframe = CFrame.fromPosition(new Vector3(x * 1.1, y * 1.1, z * 1.1));

                    p.material =
                        Material.createBasic(
                            new Content("a1172ed0-2c80-4190-9edd-eae2e978238c"));

                    p.parent = world;

                    if (y === cubeSize) {
                        topLayerOfPrimities.push(p);
                    }
                }
            }
        }

        const base = new Primitive(context);
        base.name = 'base';
        base.size = new Vector3(25, 0.5, 25);
        base.cframe = CFrame.fromPosition(new Vector3(0, -3.5, 0));
        base.parent = world;

        // Setup lighting
        const lighting = datamodel.getService(Lighting);
        lighting.ambient = new Color3(0.25, 0.25, 0.25);

        const sky = JsonInstanceSerializer.deserializeObject({
            className: 'Sky',
            properties: {
                name: 'Sky',
                skyboxTop: { content: "skybox3_py" },
                skyboxBottom: { content: "skybox3_ny" },
                skyboxLeft: { content: "skybox3_nx" },
                skyboxRight: { content: "skybox3_px" },
                skyboxFront: { content: "skybox3_pz" },
                skyboxBack: { content: "skybox3_nz" },
            },
            children: []
        }, context, Sky);
        sky.parent = lighting;

        // Create a test point light
        const pointLight = new PointLight(context);
        pointLight.cframe = CFrame.fromPosition(new Vector3(0, (cubeSize * 1.1) + 2, 0));
        pointLight.brightness = 5;
        pointLight.range = 10;
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
    
        runService.preSimulation.connect((_, elapsedTime) => {
            let cameraPosition = calculateOrbitVector();
            cameraPosition = Vector3.multiplyScalar(cameraPosition, radius);
            cameraPosition = Vector3.add(cameraPosition, camTarget);
            
            world.currentCamera!.cframe = CFrame.createLookAt(cameraPosition, camTarget);

            // Fancy top
            for (const prim of topLayerOfPrimities) {
                const newY = cubeSize + 1 + (Math.sin(elapsedTime + (prim.cframe.x * prim.cframe.z)) * Math.cos(elapsedTime + (prim.cframe.x * prim.cframe.z)) * 0.5);
                prim.cframe = CFrame.fromPosition(new Vector3(prim.cframe.x, newY, prim.cframe.z));
            }

            // Flip between cube and sphere
            const worldChildren = world.getChildren().filter(i => i instanceof Primitive && i.name !== 'base');
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