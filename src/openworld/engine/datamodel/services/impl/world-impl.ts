import DataModelServiceBase from './base/data-model-service-base';
import World from '../world';
import { DataModelServiceImpl } from '../../metadata/metadata';

@DataModelServiceImpl()
export default abstract class WorldImpl extends DataModelServiceBase<World>
{
}