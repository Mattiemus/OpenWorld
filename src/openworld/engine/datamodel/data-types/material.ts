import Content from './content';
import Color3 from '../../math/color3';

import * as _ from "lodash";

export default class Material
{
    //
    // Constructor
    //

    constructor(
        public readonly color: Color3 | Content,
        public readonly metalness: number | Content,
        public readonly roughness: number | Content,
        public readonly normal: Content | null
    ) {
        // No-op
    }

    //
    // Methods
    //

    public static createBasic(color: Color3 | Content): Material {
        return new Material(color, 0, 1, null);
    }

    public equals(other: Material): boolean {
        // Check for exact instance match
        if (this === other) {
            return true;
        }

        // Match color
        if (this.color !== other.color) {
            if (this.color instanceof Color3 && other.color instanceof Color3) {
                if (!this.color.equals(other.color)) {
                    return false;
                }
            } else if (this.color instanceof Content && other.color instanceof Content) {
                if (!this.color.equals(other.color)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        // Match metalness
        if (this.metalness !== other.metalness) {
            if (_.isNumber(this.metalness) && _.isNumber(other.metalness)) {
                if (this.metalness !== other.metalness) {
                    return false;
                }
            } else if (this.metalness instanceof Content && other.metalness instanceof Content) {
                if (!this.metalness.equals(other.metalness)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        // Match roughness
        if (this.roughness !== other.roughness) {
            if (_.isNumber(this.roughness) && _.isNumber(other.roughness)) {
                if (this.roughness !== other.roughness) {
                    return false;
                }
            } else if (this.roughness instanceof Content && other.roughness instanceof Content) {
                if (!this.roughness.equals(other.roughness)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        // Match normal
        if (this.normal !== other.normal) {
            if (this.normal !== null && other.normal !== null) {
                if (!this.normal.equals(other.normal)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }
}