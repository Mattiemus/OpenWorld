import { Container } from "inversify";
import { Class } from '../../utils/types';

let iocContainer: Container | undefined = undefined;

export function initialiseServiceLocator(regFunc: (container: Container) => void) {
    if (iocContainer !== undefined) {
        throw new Error('Service locator has already been initialised');
    }

    iocContainer = new Container();
    regFunc(iocContainer);
}

export function getService<T>(serviceBase: Class<T>): T {
    if (iocContainer === undefined) {
        throw new Error('Service locator has not been initialised');
    }

    return iocContainer.get(serviceBase);
}