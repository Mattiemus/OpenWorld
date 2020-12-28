import { Instance } from '../../elements/core/instance';
import { Class } from '../../../utils/types';
import { getMetaData } from '../metadata/metadata';

import { injectable, inject } from 'inversify';
import * as _ from "lodash";

export function serviceInstanceBinding(instanceType: string | Class<Instance> | Instance): symbol {
    if (_.isString(instanceType)) {
        return Symbol.for(`ServiceInstance<${instanceType}>`);
    }

    if (instanceType instanceof Instance) {
        return Symbol.for(`ServiceInstance<${instanceType.className}>`);
    }

    const metadata = getMetaData(instanceType);
    return Symbol.for(`ServiceInstance<${metadata.className}>`);
}

export function InjectInstance(instanceType: string | Class<Instance> | Instance) {
    return inject(serviceInstanceBinding(instanceType));
}

@injectable()
export class ServiceInstance<TInstance extends Instance>
{
    private _instance: TInstance;

    constructor(instance: TInstance) {
        this._instance = instance;
    }

    public get instance(): TInstance {
        return this._instance;
    }
}
