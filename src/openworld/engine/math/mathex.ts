export default class MathEx 
{
    public static readonly deg2rad = Math.PI / 180.0;

    private constructor() {
        // No-op
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static isApproxEqual(a: number, b: number, epsilon: number = 0.000001): boolean {
        return Math.abs(a - b) < 0.000001;
    }
}