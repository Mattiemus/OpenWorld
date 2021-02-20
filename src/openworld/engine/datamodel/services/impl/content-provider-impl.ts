import DataModelServiceBase from './base/data-model-service-base';
import ContentProvider from '../content-provider';
import { DataModelServiceImpl } from '../../metadata/metadata';

@DataModelServiceImpl()
export default abstract class ContentProviderImpl extends DataModelServiceBase<ContentProvider>
{
}