import { WorldPhysicsSystemImpl } from '../../../openworld/engine/datamodel/services/world/impl/world-physics-system-impl';

import { injectable } from 'inversify';

@injectable()
export class BrowserCannonJsWorldPhysicsSystem extends WorldPhysicsSystemImpl
{
    public destroy(): void {
        // No-op
    }
}