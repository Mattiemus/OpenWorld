import ClientReplicatorImpl from '../client-replicator-impl';

import { injectable } from "inversify";

@injectable()
export default class NullClientReplicatorImpl extends ClientReplicatorImpl
{
}