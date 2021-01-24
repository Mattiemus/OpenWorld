import MathEx from './mathex';

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

    public toNumber(alpha: number = 1): number
    {
        const r = MathEx.clampAndRound(this.r * 255, 0, 255);
        const g = (MathEx.clampAndRound(this.g * 255, 0, 255)) << 8;
        const b = (MathEx.clampAndRound(this.b * 255, 0, 255)) << 16;
        const a = (MathEx.clampAndRound(alpha * 255, 0, 255)) << 24;

        return r | g | b | a;
    }

    public toHex(alpha?: number): string
    {
        const r = MathEx.clampAndRound(this.r * 255, 0, 255);
        const g = MathEx.clampAndRound(this.g * 255, 0, 255);
        const b = MathEx.clampAndRound(this.b * 255, 0, 255);
        const a = alpha === undefined ? undefined : MathEx.clampAndRound(alpha * 255, 0, 255);

        const rStr = r.toString(16);
        const gStr = g.toString(16);
        const bStr = b.toString(16);
        const aStr = a === undefined ? '' : a.toString(16);

        return `${rStr}${gStr}${bStr}${aStr}`;
    }

    public equals(other: Color3): boolean {
        if (this === other) {
            return true;
        }

        return this.r === other.r &&
               this.g === other.g &&
               this.b === other.b;
    }
}