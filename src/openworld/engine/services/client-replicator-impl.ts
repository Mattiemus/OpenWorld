import DataModelServiceBase from './base/data-model-service-base';
import ClientReplicator from '../datamodel/services/client-replicator';
import { DataModelServiceImpl } from '../datamodel/internals/metadata/metadata';

@DataModelServiceImpl()
export default abstract class ClientReplicatorImpl extends DataModelServiceBase<ClientReplicator>
{
}