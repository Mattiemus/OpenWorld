import Instance from '../elements/instance';
import Uuid from '../../utils/uuid';
import ServiceBase from '../../services/base/service-base';
import { Class } from '../../utils/types';
import Destroyable from '../../utils/destroyable';

export default abstract class InstanceContext extends Destroyable
{
    private _instanceIds = new Map<string, Instance>();

    //
    // Methods
    //

    public registerInstance(instance: Instance): Uuid {
        const id = new Uuid();
        this._instanceIds.set(id.toString(), instance);
        return id;
    }

    public unregisterInstance(instance: Instance): void {
        // TODO
    }

    public abstract getServiceImpl<TService extends ServiceBase>(serviceBase: Class<TService>): TService;
}