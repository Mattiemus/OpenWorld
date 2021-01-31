import Instance from "../../../../../engine/datamodel/elements/instance";
import { IDestroyable } from "../../../../../engine/utils/interfaces";

export type InstanceProxy<TDataModel extends Instance> =
    THREE.Object3D & 
    IDestroyable & 
    {
        dataModel: TDataModel;
    };
