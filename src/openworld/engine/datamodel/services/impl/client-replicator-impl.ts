import DataModelServiceBase from './base/data-model-service-base';
import ClientReplicator from '../client-replicator';
import { DataModelServiceImpl } from '../../metadata/metadata';

@DataModelServiceImpl()
export default abstract class ClientReplicatorImpl extends DataModelServiceBase<ClientReplicator>
{
}