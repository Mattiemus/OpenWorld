import React from "react";
import LocalClientInstanceContext from "../contexts/local-client-instance-context";
import InstanceContext from "../../engine/datamodel/internals/instance-context";

export type OpenWorldCanvasProps = {
    instanceContext: InstanceContext;
};

export default function OpenWorldCanvas(props: OpenWorldCanvasProps) {
    const { instanceContext } = props;

    return (
        <canvas ref={canvas => {
            if (instanceContext instanceof LocalClientInstanceContext) {
                instanceContext.canvas = canvas;
            }
        }} />
    );
}