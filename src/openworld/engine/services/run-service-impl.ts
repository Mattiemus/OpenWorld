import { Signal } from 'typed-signals';
import DataModelServiceBase from './base/data-model-service-base';
import RunService from '../datamodel/services/run-service';
import { DataModelServiceImpl } from '../datamodel/internals/metadata/metadata';

@DataModelServiceImpl()
export default abstract class RunServiceImpl extends DataModelServiceBase<RunService>
{
    //
    // Signals
    //

    public abstract get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void>;
}