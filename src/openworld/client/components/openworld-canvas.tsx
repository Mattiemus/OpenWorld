import * as React from "react";
import DataModel from "../../engine/datamodel/elements/datamodel";
import LocalClientInstanceContext from "../contexts/local-client-instance-context";

type Props = {
    dataModel: DataModel;
};

type State = {
};

export class OpenWorldCanvas extends React.Component<Props, State>
{
    state: State = {};

    public render() {
        return (
            <canvas ref={this.setCanvasRef} />
        );
    }

    private setCanvasRef = (canvas: HTMLCanvasElement | null): void => {
        const context = this.props.dataModel['_context'];
        if (context instanceof LocalClientInstanceContext) {
            context.canvas = canvas;
        }
    }
}