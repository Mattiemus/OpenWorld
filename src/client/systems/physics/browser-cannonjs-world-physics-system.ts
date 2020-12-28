import { WorldPhysicsSystemImpl } from '../../../openworld/engine/datamodel/services/world/impl/world-physics-system-impl';
import { World } from '../../../openworld/engine/datamodel/services/world/world';
import { ServiceInstance, InjectInstance } from '../../../openworld/engine/datamodel/internals/services/service-instance';

import { injectable } from 'inversify';

@injectable()
export class BrowserCannonJsWorldPhysicsSystem extends WorldPhysicsSystemImpl
{
    constructor(@InjectInstance(World) world: ServiceInstance<World>) {
        super();

        // TODO
    }    

    //
    // Methods
    //

    public destroy(): void {
        // TODO
    }
}