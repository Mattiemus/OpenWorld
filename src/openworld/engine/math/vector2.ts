export interface IVector2 {
    x: number;
    y: number;
}

export default class Vector2
{
    public static readonly zero = new Vector2(0, 0);
    public static readonly one = new Vector2(1, 1);

    //
    // Constructor
    //

    constructor(
        public readonly x: number,
        public readonly y: number)
    {
        // No-op
    }

    //
    // Properties
    //

    public get length(): number {
        const lengthSquared = (this.x * this.x) + (this.y * this.y);
        return Math.sqrt(lengthSquared);
    }

    //
    // Methods
    //

    public static normalize(v: Vector2): Vector2 {
        const length = v.length;
        return new Vector2(v.x / length, v.y / length);
    }

    public static dot(a: IVector2, b: IVector2): number {
        return (a.x * b.x) + (a.y * b.y);        
    }

    public static add(a: IVector2, b: IVector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    public static subtract(a: IVector2, b: IVector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public equals(other: IVector2): boolean {
        if (this === other) {
            return true;
        }
        
        return this.x === other.x && this.y === other.y;
    }
}