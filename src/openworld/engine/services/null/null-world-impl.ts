import WorldImpl from "../world-impl";

import { injectable } from "inversify";

@injectable()
export default class NullWorldImpl extends WorldImpl
{
}