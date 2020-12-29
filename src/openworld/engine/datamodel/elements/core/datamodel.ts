import { ServiceProvider } from './service-provider';
import { DataModelClass } from '../../internals/metadata/metadata';

@DataModelClass({
    className: 'DataModel',
    parent: ServiceProvider,
    attributes: [],
    properties: {}
})
export class DataModel extends ServiceProvider
{    
}