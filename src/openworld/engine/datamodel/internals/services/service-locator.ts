import { Container } from "inversify";
import { Class } from '../../../utils/types';
import { Instance } from '../../elements/core/instance';
import { ServiceInstance, serviceInstanceBinding } from './service-instance';

let iocContainer: Container | undefined = undefined;

export function installServices(regFunc: (container: Container) => void) {
    if (iocContainer === undefined) {
        iocContainer = new Container();
    }
    
    regFunc(iocContainer);
}

export function getService<TService>(serviceBase: Class<TService>): TService {
    if (iocContainer === undefined) {
        throw new Error('Service locator has not been initialised');
    }

    return iocContainer.get(serviceBase);
}

export function getServiceFor<TService, TInstance extends Instance>(serviceBase: Class<TService>, instance: TInstance): TService {
    if (iocContainer === undefined) {
        throw new Error('Service locator has not been initialised');
    }

    iocContainer.bind(serviceInstanceBinding(instance)).toConstantValue(new ServiceInstance(instance));
    const service = iocContainer.get(serviceBase);
    iocContainer.unbind(serviceInstanceBinding(instance));

    return service;
}