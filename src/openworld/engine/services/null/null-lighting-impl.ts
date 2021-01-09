import LightingImpl from '../lighting-impl';

import { injectable } from "inversify";

@injectable()
export default class NullLightingImpl extends LightingImpl
{
}