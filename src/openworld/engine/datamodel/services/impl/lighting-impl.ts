import DataModelServiceBase from './base/data-model-service-base';
import Lighting from '../lighting';
import { DataModelServiceImpl } from '../../metadata/metadata';

@DataModelServiceImpl()
export default abstract class LightingImpl extends DataModelServiceBase<Lighting>
{
}