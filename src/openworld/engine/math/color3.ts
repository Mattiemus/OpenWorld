import MathEx from './mathex';
import { hasField } from '../utils/type-guards';
import { IVector3 } from './vector3';

export interface IColor3 {
    r: number;
    g: number;
    b: number;
}

export enum Color3Format {
    RGBA,
    BGRA
};

export default class Color3
{
    public static readonly white = new Color3(1, 1, 1);
    public static readonly black = new Color3(0, 0, 0);

    //
    // Constructor
    //

    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number)
    {
        this.r = MathEx.clamp(r, 0.0, 1.0);
        this.g = MathEx.clamp(g, 0.0, 1.0);
        this.b = MathEx.clamp(b, 0.0, 1.0);
    }

    //
    // Methods
    //

    public static fromHex(hex: string): Color3 | undefined {
        const match = hex.match(/^#([0-9a-f]{6})$/i);
        if (match === null || match.length === 0) {
            return undefined;
        }

        const match0 = match[0];

        const red = parseInt(match0.substr(1, 2), 16);
        if (Number.isNaN(red)) {
            return undefined;
        }

        const green = parseInt(match0.substr(3, 2), 16);
        if (Number.isNaN(green)) {
            return undefined;
        }

        const blue = parseInt(match0.substr(5, 2), 16);
        if (Number.isNaN(blue)) {
            return undefined;
        }

        return Color3.fromRGB(red, green, blue);
    }

    public static fromRGB(red: number, green: number, blue: number): Color3 {
        red = MathEx.clamp(red, 0, 255) / 255;
        green = MathEx.clamp(green, 0, 255) / 255;
        blue = MathEx.clamp(blue, 0, 255) / 255;

        return new Color3(red, green, blue);
    }

    public static fromHSV(hue: number, saturation: number, value: number): Color3 {
        hue = MathEx.clamp(hue, 0, 360);
        saturation = MathEx.clamp(saturation, 0, 100);
        value = MathEx.clamp(value, 0, 100);

        const s = saturation / 100;
        const v = value / 100;
        const C = s * v;
        const X = C * (1 - Math.abs(((hue / 60.0) % 2) - 1));
        const m = v - C;
        
        let r = 0;
        let g = 0;
        let b = 0;
        
        if (hue >= 0 && hue < 60) {
            r = C;
            g = X;
            b = 0;
        } else if (hue >= 60 && hue < 120) {
            r = X;
            g = C;
            b = 0;
        } else if (hue >= 120 && hue < 180) {
            r = 0;
            g = C;
            b = X;
        } else if (hue >= 180 && hue < 240) {
            r = 0;
            g = X;
            b = C;
        } else if (hue >= 240 && hue < 300) {
            r = X;
            g = 0;
            b = C;
        } else {
            r = C;
            g = 0;
            b = X;
        }

        const red = r + m;
        const green = g + m;
        const blue = b + m;

        return new Color3(red, green, blue);
    }

    public toNumber(alpha: number = 1, format: Color3Format = Color3Format.RGBA): number {
        if (format === Color3Format.RGBA) {
            const r = MathEx.clampAndRound(this.r * 255, 0, 255);
            const g = (MathEx.clampAndRound(this.g * 255, 0, 255)) << 8;
            const b = (MathEx.clampAndRound(this.b * 255, 0, 255)) << 16;
            const a = (MathEx.clampAndRound(alpha * 255, 0, 255)) << 24;

            return r | g | b | a;
        }

        if (format === Color3Format.BGRA) {
            const b = MathEx.clampAndRound(this.b * 255, 0, 255);
            const g = (MathEx.clampAndRound(this.g * 255, 0, 255)) << 8;
            const r = (MathEx.clampAndRound(this.r * 255, 0, 255)) << 16;
            const a = (MathEx.clampAndRound(alpha * 255, 0, 255)) << 24;

            return b | g | r | a;
        }

        return 0;
    }

    public toHex(alpha?: number): string {
        const r = MathEx.clampAndRound(this.r * 255, 0, 255);
        const g = MathEx.clampAndRound(this.g * 255, 0, 255);
        const b = MathEx.clampAndRound(this.b * 255, 0, 255);
        const a = alpha === undefined ? undefined : MathEx.clampAndRound(alpha * 255, 0, 255);

        const rStr = r.toString(16).padStart(2, '0');
        const gStr = g.toString(16).padStart(2, '0');
        const bStr = b.toString(16).padStart(2, '0');
        const aStr = a === undefined ? '' : a.toString(16).padStart(2, '0');

        return `#${rStr}${gStr}${bStr}${aStr}`;
    }

    public clone(): Color3 {
        return new Color3(this.r, this.g, this.b);
    }

    public equals(other: IColor3 | IVector3): boolean {
        if (this === other) {
            return true;
        }

        if (hasField('x', other)) {
            return this.r === other.x &&
                   this.g === other.y &&
                   this.b === other.z;            
        }

        return this.r === other.r &&
               this.g === other.g &&
               this.b === other.b;
    }
}