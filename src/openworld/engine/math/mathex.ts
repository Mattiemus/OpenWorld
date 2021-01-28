export default class MathEx 
{
    public static readonly piOverTwo = Math.PI / 2.0;
    public static readonly piOverFour = Math.PI / 4.0;
    public static readonly threePiOverFour = (3.0 * Math.PI) / 4.0;
    public static readonly twoPi = Math.PI * 2.0;
    public static readonly piSquared = Math.PI * Math.PI;
    public static readonly deg2rad = Math.PI / 180.0;
    public static readonly rad2deg = 180.0 / Math.PI;
    /*
    public const float OneThird = (float) (1.0d / 3.0d);
    public const float TwoThird = (float) (2.0d / 3.0d);
    public const float FourThirds = (float)(2.0d / 3.0d);
    public const float ZeroTolerance = 1E-06f;
    public const float TightZeroTolerance = 1E-12f;
    public const float Epsilon = float.Epsilon;
    */
   
    private constructor() {
        // No-op
    }

    public static random(min: number, max: number): number {
        const range = max - min;
        return min + (Math.random() * range);
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static clampAndRound(value: number, min: number, max: number): number {
        if (Number.isNaN(value)) {
            return 0;
        }

        if (!Number.isFinite(value)) {
            if (value === Number.NEGATIVE_INFINITY) {
                return min;
            }

            return max;
        }

        if(value < min) {
            return min;
        }

        if(value > max) {
            return max;
        }

        return Math.round(value);
    }

    public static isApproxEqual(a: number, b: number, epsilon: number = 0.000001): boolean {
        return Math.abs(a - b) < epsilon;
    }

    public static isApproxZero(a: number, epsilon: number = 0.000001): boolean {
        return Math.abs(a) < epsilon;
    }
}