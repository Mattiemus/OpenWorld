import { Instance } from '../core/instance';
import { Uuid } from '../../utils/uuid';

export class InstanceManager
{
    private static _instanceIds = new Map<string, Instance>();

    private constructor() {
        // No-op
    }

    public static registerInstance(instance: Instance): Uuid {
        const id = new Uuid();
        InstanceManager._instanceIds.set(id.toString(), instance);
        return id;
    }

    public static getInstanceRefId(instance: Instance): string {
        return instance['_refId'].toString();
    }

    public static getInstanceFromRefId(refId: string): Instance | undefined {
        return InstanceManager._instanceIds.get(refId);
    }
}