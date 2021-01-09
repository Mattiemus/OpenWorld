import ContentProviderImpl from '../content-provider-impl';

import { injectable } from "inversify";

@injectable()
export default class NullContentProviderImpl extends ContentProviderImpl
{
}