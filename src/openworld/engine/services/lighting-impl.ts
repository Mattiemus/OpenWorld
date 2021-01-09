import DataModelServiceBase from './base/data-model-service-base';
import Lighting from '../datamodel/services/lighting';
import { DataModelServiceImpl } from '../datamodel/internals/metadata/metadata';

@DataModelServiceImpl()
export default abstract class LightingImpl extends DataModelServiceBase<Lighting>
{
}