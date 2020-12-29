import ServiceBase from "./service-base";
import Instance from '../../datamodel/elements/instance';

export default class DataModelServiceBase<TService extends Instance> extends ServiceBase
{
    private _currentDataModel: TService | undefined = undefined;

    //
    // Methods
    //

    public attatch(dataModel: TService): void {
        if (this._currentDataModel !== undefined) {
            throw new Error('Cannot attatch service implementation as it has already been attatched');
        }

        this._currentDataModel = dataModel;
        this.onAttatch(dataModel);
    }

    public detatch(dataModel: TService): void {
        this.onDetatch(dataModel);
        this._currentDataModel = undefined;
    }

    protected onAttatch(dataModel: TService): void {
        // No-op
    }

    protected onDetatch(dataModel: TService): void {
        // No-op
    }
}