import DataModelServiceBase from './base/data-model-service-base';
import ContentProvider from '../datamodel/services/content-provider';
import { DataModelServiceImpl } from '../datamodel/internals/metadata/metadata';

@DataModelServiceImpl()
export default abstract class ContentProviderImpl extends DataModelServiceBase<ContentProvider>
{
}