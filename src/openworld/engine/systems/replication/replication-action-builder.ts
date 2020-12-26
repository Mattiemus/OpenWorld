import { Instance } from '../../../../shared/datamodel/core/instance';
import { getMetaData } from '../../../../shared/datamodel/internals/metadata/metadata';
import { InstanceManager } from '../../../../shared/datamodel/internals/instance-manager';
import { ReplicationCreateAction } from './replication-create-action';
import { ReplicationDestroyAction } from './replication-destroy-action';

export class ReplicationActionBuilder 
{
    private constructor() {
        // No-op
    }
    
    public static toCreateAction(instance: Instance): ReplicationCreateAction {
        const metadata = getMetaData(instance);
        if (metadata.hasAttribute('NotReplicated')) {
            throw new Error(`Cannot replicate "${instance.className}" as it is not a replicatable instance`);            
        }

        let createAction: ReplicationCreateAction = { 
            action: 'create',
            refId: InstanceManager.getInstanceRefId(instance),
            className: instance.className,
            properties: {}
        };


        metadata.properties.forEach((v, k) => {
            if (v.hasAttribute('NotReplicated')) {
                return;
            }

            createAction.properties[k] = v.type.toJson(instance, k);
        });

        return createAction;
    }

    public static toDestroyAction(instance: Instance): ReplicationDestroyAction {
        return {
            action: 'destroy',
            refId: InstanceManager.getInstanceRefId(instance)
        };
    }
}