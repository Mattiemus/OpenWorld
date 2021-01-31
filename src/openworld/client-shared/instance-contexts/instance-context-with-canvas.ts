import InstanceContext from "../../engine/datamodel/internals/instance-context";

export default interface IInstanceContextWithCanvas extends InstanceContext {
    canvas: HTMLCanvasElement | null;
};