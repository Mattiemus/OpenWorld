import { DataModelClass } from '../../internals/metadata/metadata';
import { ServiceProvider } from './service-provider';

@DataModelClass({
    className: 'DataModel',
    parent: ServiceProvider,
    attributes: [],
    properties: {}
})
export class DataModel extends ServiceProvider
{    
}