import { DataModelClass } from "../metadata/metadata";
import Instance from "../elements/instance";
import ContentProviderImpl from "./impl/content-provider-impl";
import InstanceContext from '../context/instance-context';

@DataModelClass({
    className: 'ContentProvider',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated', 'EditorHidden' ],
    properties: {}
})
export default abstract class ContentProvider extends Instance
{
    private _impl: ContentProviderImpl;

    //
    // Constructor
    //

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);

        this._impl = context.getServiceImpl(ContentProviderImpl);
        this._impl.attatch(this);

        this.finishConstruction(refId);
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this._impl.detatch(this);
    }
}