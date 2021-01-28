import Instance from "../elements/instance";
import { Class } from "../../utils/types";
import { isString } from "../../utils/type-guards";
import { getMetaData } from "../internals/metadata/metadata";

export default class InstanceUtils
{
    public static isA<TInstanceA extends Instance, TInstanceB extends Instance>(
        instanceClass: string | Class<TInstanceA>,
        expectedInstanceBaseClass: string | Class<TInstanceB>
    ): boolean {
        if (!isString(expectedInstanceBaseClass)) {
            const expectedInstanceBaseMetaData = getMetaData(instanceClass);
            expectedInstanceBaseClass = expectedInstanceBaseMetaData.className;
        }

        let metadata = getMetaData(instanceClass);
        while (metadata !== null) {
            if (expectedInstanceBaseClass === metadata.className) {
                return true;
            }

            if (metadata.parent === null) {
                break;
            } else {
                metadata = getMetaData(metadata.parent);
            }
        }

        return false;
    }

    public static unsafeGetProperty<T>(instance: Instance, propertyName: string): T {
        const unsafeInstance = instance as any;
        return unsafeInstance[propertyName];
    }

    public static unsafeSetProperty(instance: Instance, propertyName: string, newValue: any): void {
        const unsafeInstance = instance as any;
        unsafeInstance[propertyName] = newValue;
    }
}