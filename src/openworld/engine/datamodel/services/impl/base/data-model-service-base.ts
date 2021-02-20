import ServiceBase from "./service-base";
import Instance from '../../../elements/instance';

import { injectable } from "inversify";

@injectable()
export default class DataModelServiceBase<TService extends Instance> extends ServiceBase
{
    private _currentDataModel: TService | null = null;

    //
    // Properties
    //

    protected get currentDataModel(): TService | null {
        return this._currentDataModel;
    }

    //
    // Methods
    //

    public attatch(dataModel: TService): void {
        if (this._currentDataModel !== null) {
            throw new Error('Cannot attatch service implementation as it has already been attatched');
        }

        this._currentDataModel = dataModel;
        this.onAttatch(dataModel);
    }

    public detatch(dataModel: TService): void {
        if (this._currentDataModel !== dataModel) {
            throw new Error('Cannot detatch from different data model to the one the service is connected to');
        }

        this.onDetatch();
        this._currentDataModel = null;
    }

    protected onDestroy(): void {
        if (this._currentDataModel !== null) {
            this.detatch(this._currentDataModel);
        }

        super.onDestroy();
    }

    protected onAttatch(dataModel: TService): void {
        // No-op
    }

    protected onDetatch(): void {
        // No-op
    }
}