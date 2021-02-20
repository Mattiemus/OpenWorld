import React, { useLayoutEffect } from "react";
import IInstanceContextWithCanvas from "../datamodel/context/instance-context-with-canvas";

export type InstanceContextRenderCanvasProps = {
    instanceContext: IInstanceContextWithCanvas;
};

export default function InstanceContextRenderCanvas(props: InstanceContextRenderCanvasProps) {
    const { instanceContext } = props;

    useLayoutEffect(() => {
        return () => {
            instanceContext.canvas = null;
        }
    }, [ instanceContext ]);

    const setCanvas = (canvas: HTMLCanvasElement) => {
        instanceContext.canvas = canvas;
    };

    return (
        <canvas ref={setCanvas} />
    );
}