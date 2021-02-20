import InstanceContext from "../../../engine/datamodel/context/instance-context";

export default interface IInstanceContextWithCanvas extends InstanceContext {
    canvas: HTMLCanvasElement | null;
};