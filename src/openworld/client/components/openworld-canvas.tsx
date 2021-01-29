import React, { useRef, useEffect } from "react";
import LocalClientInstanceContext from "../contexts/local-client-instance-context";
import InstanceContext from "../../engine/datamodel/internals/instance-context";

export type OpenWorldCanvasProps = {
    instanceContext: InstanceContext;
};

export default function OpenWorldCanvas(props: OpenWorldCanvasProps) {
    const { instanceContext } = props;

    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        return () => {
            if (canvasRef.current === undefined) {
                return;
            }

            if (instanceContext instanceof LocalClientInstanceContext) {
                if (instanceContext.canvas !== canvasRef.current) {
                    throw new Error("Instance context already had its canvas set");
                }
    
                instanceContext.canvas = null;
            }
        }
    }, []);

    const setCanvas = (canvas: HTMLCanvasElement) => {
        if (instanceContext instanceof LocalClientInstanceContext) {
            if (instanceContext.canvas !== null) {
                throw new Error("Instance context already had its canvas set");
            }

            instanceContext.canvas = canvas;
        }

        canvasRef.current = canvas;
    };

    return (
        <canvas ref={setCanvas} />
    );
}