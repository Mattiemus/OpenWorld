export default class MathEx 
{
    public static readonly deg2rad = Math.PI / 180.0;

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