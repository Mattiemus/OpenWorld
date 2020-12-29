import Content from './Content';
import Color3 from '../../math/color3';

export default class MaterialProperties
{
    //
    // Constructor
    //

    constructor(
        public readonly color: Color3 | Content,
        public readonly metalness: number | Content,
        public readonly roughness: number | Content,
        public readonly normal: Content | null)
    {
        // No-op
    }

    //
    // Methods
    //

    public static createBasicColor(color: Color3): MaterialProperties {
        return new MaterialProperties(color, 0, 1, null);
    }
}