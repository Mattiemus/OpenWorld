export interface IVector3 {
    x: number;
    y: number;
    z: number;
}

export default class Vector3 
{
    public static readonly zero = new Vector3(0, 0, 0);
    public static readonly one = new Vector3(1, 1, 1);
    public static readonly left = new Vector3(-1, 0, 0);
    public static readonly right = new Vector3(1, 0, 0);
    public static readonly up = new Vector3(0, 1, 0);
    public static readonly down = new Vector3(0, -1, 0);
    public static readonly forward = new Vector3(0, 0, 1);
    public static readonly backward = new Vector3(0, 0, -1);

    //
    // Constructor
    //

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number)
    {
        // No-op
    }

    //
    // Properties
    //

    public get lengthSquared(): number {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }

    public get length(): number {
        const lengthSquared = this.lengthSquared;
        return Math.sqrt(lengthSquared);
    }

    //
    // Methods
    //

    public static normalize(v: Vector3): Vector3 {
        const length = v.length;
        return new Vector3(v.x / length, v.y / length, v.z / length);
    }

    public static dot(a: IVector3, b: IVector3): number {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);        
    }

    public static cross(a: IVector3, b: IVector3): Vector3 {
        const x = (a.y * b.z) - (a.z * b.y);
        const y = (a.z * b.x) - (a.x * b.z);
        const z = (a.x * b.y) - (a.y * b.x);

        return new Vector3(x, y, z);
    }

    public static add(a: IVector3, b: IVector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public static subtract(a: IVector3, b: IVector3): Vector3 {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public static multiply(a: IVector3, b: IVector3): Vector3 {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    public static multiplyScalar(a: IVector3, scale: number): Vector3 {
        return new Vector3(a.x * scale, a.y * scale, a.z * scale);
    }

    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    public equals(other: IVector3): boolean {
        if (this === other) {
            return true;
        }
        
        return this.x === other.x &&
               this.y === other.y &&
               this.z === other.z;
    }
}