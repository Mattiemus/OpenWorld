import { DataModelClass } from '../internals/metadata/metadata';
import { ServiceProvider } from './service-provider';

@DataModelClass({
    className: 'OpenWorld',
    parent: ServiceProvider,
    attributes: [],
    properties: {}
})
export class OpenWorld extends ServiceProvider
{    
}