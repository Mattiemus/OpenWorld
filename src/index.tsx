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
import JsonInstanceSerializer from './openworld/engine/datamodel/serialization/json/json-instance-serializer';
import { OpenWorldCanvas } from "./openworld/client/components/openworld-canvas";
import { WorkerThread } from "./openworld/engine/threading/contexts/main-thread/worker-thread";

function createDataModel(): DataModel {
    const context = new LocalClientInstanceContext();

    // TODO: Implement this fully
    const worker = new WorkerThread(context);
    

    const datamodel = context.dataModel;
    const world = datamodel.getService(World);

    const camera = new Camera(context);
    world.currentCamera = camera;

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

    const base = JsonInstanceSerializer.deserializeObject({
        className: 'Primitive',
        refId: 'bb5bbcf9-f72a-4e9a-b9cf-dcc4b2e791c8',
        properties: {
            name: 'base',
            size: [ 25, 0.5, 25 ],
            cframe: [ 0, -3.5, 0, 0, 0, 0, 1 ]
        }
    }, context, true, Primitive);
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

    const sky = JsonInstanceSerializer.deserializeObjectUnsafe({
        className: 'Sky',
        refId: '507b1c82-9e94-4e6d-ac48-0ed6b4da66ef',
        properties: {
            name: 'Sky',
            skyboxTop: { content: "skybox3_py" },
            skyboxBottom: { content: "skybox3_ny" },
            skyboxLeft: { content: "skybox3_nx" },
            skyboxRight: { content: "skybox3_px" },
            skyboxFront: { content: "skybox3_pz" },
            skyboxBack: { content: "skybox3_nz" },
        }
    }, context, true, Sky);
    sky.parent = lighting;

    return datamodel;
}

render(
    <OpenWorldCanvas dataModel={createDataModel()} />,   
    document.getElementById('root')
);