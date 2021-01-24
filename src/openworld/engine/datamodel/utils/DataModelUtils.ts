import Camera from '../elements/camera';
import ClientReplicator from '../services/client-replicator';
import ContentProvider from '../services/content-provider';
import DataModel from '../elements/datamodel';
import Instance from '../elements/instance';
import Light from '../elements/light';
import Lighting from '../services/lighting';
import Mouse from '../services/mouse';
import NetworkReplicator from '../services/network-replicator';
import PointLight from '../elements/point-light';
import Primitive from '../elements/primitive';
import RunService from '../services/run-service';
import ServiceProvider from '../elements/service-provider';
import Sky from '../elements/sky';
import World from '../services/world';
import WorldObject from '../elements/world-object';
import { Class } from '../../utils/types';
import { getMetaData } from '../internals/metadata/metadata';
import BaseScript from '../elements/base-script';
import ClientScript from '../elements/client-script';

export default class DataModelUtils
{
    public static initialiseMetaData(): void {
        const allTypes = this.getAllTypes();
        
        const consoleText = allTypes
            .map(ty => {
                const metadata = getMetaData(ty);
                return metadata.className;
            })
            .join(', ');

        console.log(`Initialised data model types: ${consoleText}`);        
    }

    public static getAllTypes(): Class<Instance>[] {
        return [
            BaseScript,
            Camera,
            ClientScript,
            DataModel,
            Instance,
            Light,
            PointLight,
            Primitive,
            ServiceProvider,
            Sky,
            WorldObject,
            ClientReplicator,
            ContentProvider,
            Lighting,
            Mouse,
            NetworkReplicator,
            RunService,
            World
        ];
    }
}