import "reflect-metadata";

import InterThreadCommunication from "./openworld/engine/threading/inter-thread-communication";
import WorkerThreadInstanceContext from './openworld/engine/threading/contexts/worker-thread/worker-thread-instance-context';

import DataModel from './openworld/engine/datamodel/elements/datamodel';
import World from "./openworld/engine/datamodel/services/world";
import Lighting from "./openworld/engine/datamodel/services/lighting";
import Camera from "./openworld/engine/datamodel/elements/camera";
import Primitive from './openworld/engine/datamodel/elements/primitive';
import PointLight from './openworld/engine/datamodel/elements/point-light';
import Sky from './openworld/engine/datamodel/elements/sky';
import Mouse from './openworld/engine/datamodel/services/mouse';
import RunService from "./openworld/engine/datamodel/services/run-service";
import ContentProvider from './openworld/engine/datamodel/services/content-provider';
import ServiceProvider from './openworld/engine/datamodel/elements/service-provider';

const bodge = [DataModel, World, Lighting, Camera, Primitive, PointLight, Sky, Mouse, RunService, ContentProvider, ServiceProvider];

(async () => {
    const comms = new InterThreadCommunication(globalThis as any);

    const context = new WorkerThreadInstanceContext(comms);
    await context.whenSynchronized();
    
    // TODO: Move this into a CoreObject instance!
    const s = await import('./openworld/engine/scripting/core-scripts/orbit-camera');
    const script = new s.default(context);
    script.run();
})();