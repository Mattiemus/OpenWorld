import { Instance } from '../../../openworld/engine/datamodel/elements/core/instance';
import { IDestroyable } from '../../../openworld/engine/utils/interfaces';
import { SignalConnection } from 'typed-signals';
import { CFrame } from '../../../openworld/engine/math/cframe';

import * as THREE from 'three';

export abstract class ThreeJsDataModelProxy<TDataModel extends Instance & { cframe: CFrame; }, TThreeObject extends THREE.Object3D> implements IDestroyable {
    private _dataModel: TDataModel;
    private _threeObject: TThreeObject;    
    private _cframeChangedConnection: SignalConnection;

    constructor(dataModel: TDataModel) {
        this._dataModel = dataModel;

        this._threeObject = this.createThreeObject(dataModel);
        this.addThreeObjectToDataModel(dataModel, this._threeObject);
        this.onDataModelCFrameUpdated();

        // TODO: Handle parent changing!

        const threeObjectParent = this.findParentThreeObject(dataModel);
        threeObjectParent.add(this._threeObject);

        const cframeChangedSignal = dataModel.getPropertyChangedSignal('cframe')!;
        this._cframeChangedConnection = cframeChangedSignal.connect(this.onDataModelCFrameUpdated.bind(this));
    }

    //
    // Properties
    //

    public get dataModel(): TDataModel {
        return this._dataModel;
    }

    public get threeObject(): TThreeObject {
        return this._threeObject;
    }

    //
    // Methods
    //

    public destroy(): void {
        this._cframeChangedConnection.disconnect();
        this.removeThreeObjectFromDataModel(this._dataModel);
    }   

    protected abstract createThreeObject(dataModel: TDataModel): TThreeObject;

    protected copyCFrame(dataModel: TDataModel, threeObject: TThreeObject): void {
        threeObject.position.set(dataModel.cframe.x, dataModel.cframe.y, dataModel.cframe.z);
        threeObject.quaternion.set(this._dataModel.cframe.qx, this._dataModel.cframe.qy, this._dataModel.cframe.qz, this._dataModel.cframe.qw);
    }

    private addThreeObjectToDataModel(dataModel: TDataModel, threeObject: TThreeObject): void {
        const unsafeDataModel = dataModel as any;
        unsafeDataModel.__cachedThreeObject = threeObject;     
    }
    
    private removeThreeObjectFromDataModel(dataModel: TDataModel): void {
        const unsafeDataModel = dataModel as any;
        if (unsafeDataModel.__cachedThreeObject !== undefined) {
            delete unsafeDataModel.__cachedThreeObject;
        }
    }

    private findParentThreeObject(dataModel: Instance): THREE.Object3D {
        if (dataModel.parent === null) {
            throw new Error('Could not find parent cached three object');
        }

        const unsafeDataModelParent = dataModel.parent as any;

        if (unsafeDataModelParent.__cachedThreeObject !== undefined) {
            return unsafeDataModelParent.__cachedThreeObject;
        }

        return this.findParentThreeObject(dataModel.parent);
    } 

    private onDataModelCFrameUpdated(): void {
        this.copyCFrame(this._dataModel, this._threeObject);
    }
}
