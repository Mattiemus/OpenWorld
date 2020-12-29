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

    public get length(): number {
        const lengthSquared = (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
        return Math.sqrt(lengthSquared);
    }

    //
    // Methods
    //

    public static normalize(v: Vector3): Vector3 {
        const length = v.length;
        return new Vector3(v.x / length, v.y / length, v.z / length);
    }

    public static dot(a: Vector3, b: Vector3): number {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);        
    }

    public static cross(a: Vector3, b: Vector3): Vector3 {
        const x = (a.y * b.z) - (a.z * b.y);
        const y = (a.z * b.x) - (a.x * b.z);
        const z = (a.x * b.y) - (a.y * b.x);

        return new Vector3(x, y, z);    
    }

    public static add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public static subtract(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public static multiply(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    public static multiplyScalar(a: Vector3, scale: number): Vector3 {
        return new Vector3(a.x * scale, a.y * scale, a.z * scale);
    }
}