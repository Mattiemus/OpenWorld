import { DataModelClass } from "../internals/metadata/metadata";
import Instance from "../elements/instance";
import ContentProviderImpl from "../../services/content-provider-impl";
import InstanceContext from '../internals/instance-context';

@DataModelClass({
    className: 'ContentProvider',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export default abstract class ContentProvider extends Instance
{
    private _impl: ContentProviderImpl;

    //
    // Constructor
    //

    constructor(context: InstanceContext) {
        super(context);

        this._impl = context.getServiceImpl(ContentProviderImpl);
        this._impl.attatch(this);
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this._impl.detatch(this);
    }
}