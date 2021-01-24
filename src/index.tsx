import "reflect-metadata";

import "./index.css"

import * as React from "react";
import { render } from "react-dom";
import DataModel from "./openworld/engine/datamodel/elements/datamodel";
import World from "./openworld/engine/datamodel/services/world";
import Camera from "./openworld/engine/datamodel/elements/camera";
import Primitive from "./openworld/engine/datamodel/elements/primitive";
import CFrame from "./openworld/engine/math/cframe";
import Vector3 from "./openworld/engine/math/vector3";
import Lighting from "./openworld/engine/datamodel/services/lighting";
import Color3 from "./openworld/engine/math/color3";
import PointLight from './openworld/engine/datamodel/elements/point-light';
import Material from "./openworld/engine/datamodel/data-types/material";
import Content from "./openworld/engine/datamodel/data-types/content";
import Sky from './openworld/engine/datamodel/elements/sky';
import LocalClientInstanceContext from "./openworld/client/contexts/local-client-instance-context";
import { OpenWorldCanvas } from "./openworld/client/components/openworld-canvas";
import { WorkerThread } from "./openworld/engine/threading/contexts/main-thread/worker-thread";
import DataModelUtils from "./openworld/engine/datamodel/utils/DataModelUtils";
import ClientScript from "./openworld/engine/datamodel/elements/client-script";
import { ScriptLanguage } from "./openworld/engine/datamodel/elements/base-script";
import DataModelDebugger from "./openworld/client/components/data-model-debugger";

DataModelUtils.initialiseMetaData();

function createDataModel(): DataModel {
    const context = new LocalClientInstanceContext();

    // TODO: Implement this fully
    const worker =
        new WorkerThread(
            context, 
            new Worker(
                './openworld/client/worker-threads/script-thread-worker',
                { 
                    name: 'work',
                    type: 'module'
                }));
    
    const datamodel = context.dataModel;
    const world = datamodel.getService(World);

    const camera = new Camera(context);
    world.currentCamera = camera;

    /*
    // Create some shapes to look at (as these are created on the client they are local only)
    const cubeSize = 4 / 2;
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
    */



   for (let x = -10; x < 10; x++) {

    const p = new Primitive(context);
    p.cframe = CFrame.fromPosition(new Vector3(x * 1.1, Math.sin(x) * 1.1, 0));

    p.material =
        Material.createBasic(
            new Content("a1172ed0-2c80-4190-9edd-eae2e978238c"));

    p.parent = world;
}



    // Create base platform
    const base = new Primitive(context);
    base.name = 'base';
    base.size = new Vector3(25, 0.5, 25);
    base.cframe = CFrame.fromPosition(new Vector3(0, -3.5, 0));
    base.parent = world;

    // Create a test point light
    const pointLight = new PointLight(context);
    pointLight.cframe = CFrame.fromPosition(new Vector3(0, 6, 0));
    pointLight.brightness = 5;
    pointLight.range = 15;
    pointLight.parent = world;

    // Setup lighting
    const lighting = datamodel.getService(Lighting);
    lighting.ambient = new Color3(0.25, 0.25, 0.25);

    // Skybox
    const sky = new Sky(context);
    sky.skyboxTop = new Content("skybox3_py");
    sky.skyboxBottom = new Content("skybox3_ny");
    sky.skyboxLeft = new Content("skybox3_nx");
    sky.skyboxRight = new Content("skybox3_px");
    sky.skyboxFront = new Content("skybox3_pz");
    sky.skyboxBack = new Content("skybox3_nz");
    sky.parent = lighting;

    // Camera script
    const cameraScript = new ClientScript(context);
    cameraScript.language = ScriptLanguage.javascript;
    cameraScript.source = `
            let mouseSensitivity = new Vector2(1, 1);
            let radius = 8.0;
            let radiusMin = 1.0;
            let radiusMax = 30.0;
            let theta = 0.0;
            let phi = 0.0;
            let phiMin = -85;
            let phiMax = 85;
            const camTarget = new Vector3(0, 0, 0);

            const mouse = dataModel.getService(Mouse);
            const runService = dataModel.getService(RunService);

            runner.addSignalConnection(
                mouse.wheelDown.connect(() => {
                    radius += 1.0;
                    radius = MathEx.clamp(radius, radiusMin, radiusMax);
                }));
            
            runner.addSignalConnection(
                mouse.wheelUp.connect(() => {        
                    radius -= 1.0;
                    radius = MathEx.clamp(radius, radiusMin, radiusMax);
                }));

            runner.addSignalConnection(
                mouse.move.connect((deltaX, deltaY) => {
                    if (!mouse.isRightButtonDown) {
                        return;
                    }
            
                    theta -= deltaX * (mouseSensitivity.x / 2.0);
                    theta %= 360;
            
                    phi += deltaY * (mouseSensitivity.y / 2.0);
                    phi = MathEx.clamp(phi, phiMin, phiMax);
                }));

            runner.addSignalConnection(
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
        `;
    cameraScript.parent = world;

    // Sin graph script
    const sinGraphScript = new ClientScript(context);
    sinGraphScript.language = ScriptLanguage.javascript;
    sinGraphScript.source = `
            for (let x = -10; x < 10; x++) {

                const p = new Primitive(context);
                p.cframe = CFrame.fromPosition(new Vector3(x * 1.1, Math.sin(x) * 1.1, 0));

                p.material =
                    Material.createBasic(
                        new Content("a1172ed0-2c80-4190-9edd-eae2e978238c"));

                p.parent = world;
            }
        `;
    sinGraphScript.parent = world;

    return datamodel;
}

const dataModel = createDataModel();

render(
    ( <> <OpenWorldCanvas dataModel={dataModel} /> <DataModelDebugger dataModel={dataModel} /> </> ),   
    document.getElementById('root')
);