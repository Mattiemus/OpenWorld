import ServiceBase from "./service-base";
import Instance from '../../datamodel/elements/instance';

export default class DataModelServiceBase<TService extends Instance> extends ServiceBase
{
    private _currentDataModel: TService | undefined = undefined;

    //
    // Properties
    //

    protected get currentDataModel(): TService | undefined {
        return this._currentDataModel;
    }

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
        if (this._currentDataModel !== dataModel) {
            throw new Error('Cannot detatch from different data model to the one the service is connected to');
        }

        this.onDetatch();
        this._currentDataModel = undefined;
    }

    protected onDestroy(): void {
        if (this._currentDataModel !== undefined) {
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