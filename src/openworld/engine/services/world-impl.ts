import DataModelServiceBase from './base/data-model-service-base';
import World from '../datamodel/services/world';
import { DataModelServiceImpl } from '../datamodel/internals/metadata/metadata';

@DataModelServiceImpl()
export default abstract class WorldImpl extends DataModelServiceBase<World>
{
}