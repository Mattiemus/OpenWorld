import Vector3 from './vector3';

export default class Quaternion 
{
    public static readonly identity = new Quaternion(0, 0, 0, 1);
    public static readonly one = new Quaternion(1, 1, 1, 1);

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number,
        public readonly w: number)
    {
        // No-op
    }

    //
    // Methods
    //

    public static fromAxis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Quaternion {
        const xx = xAxis.x;
        const xy = xAxis.y;
        const xz = xAxis.z;

        const yx = yAxis.x;
        const yy = yAxis.y;
        const yz = yAxis.z;

        const zx = zAxis.x;
        const zy = zAxis.y;
        const zz = zAxis.z;

        const trace = xx + yy + zz;
        if(trace > 0.0) {
            let sqrt = Math.sqrt(trace + 1.0);
            const half = 0.5 * sqrt;
            sqrt = 0.5 / sqrt;

            const x = (yz - zy) * sqrt;
            const y = (zx - xz) * sqrt;
            const z = (xy - yx) * sqrt;
            const w = half;

            return new Quaternion(x, y, z, w);
        } else if((xx >= yy) && (xx >= zz)) {
            const sqrt = Math.sqrt((((1.0 + xx) - yy) - zz));
            const halfAngle = 0.5 / sqrt;

            const x = 0.5 * sqrt;
            const y = (xy + yx) * halfAngle;
            const z = (xz + zx) * halfAngle;
            const w = (yz - zy) * halfAngle;

            return new Quaternion(x, y, z, w);
        } else if(yy > zz) {
            const sqrt = Math.sqrt((((1.0 + yy) - xx) - zz));
            const halfAngle = 0.5 / sqrt;

            const x = (yx + xy) * halfAngle;
            const y = 0.5 * sqrt;
            const z = (zy + yz) * halfAngle;
            const w = (zx - xz) * halfAngle;

            return new Quaternion(x, y, z, w);
        } else {
            const sqrt = Math.sqrt((((1.0 + zz) - xx) - yy));
            const halfAngle = 0.5 / sqrt;

            const x = (zx + xz) * halfAngle;
            const y = (zy + yz) * halfAngle;
            const z = 0.5 * sqrt;
            const w = (xy - yx) * halfAngle;

            return new Quaternion(x, y, z, w);
        }
    }

    public static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
        const halfAngle = angle * 0.5;
        const s = Math.sin(halfAngle);
        const c = Math.cos(halfAngle);

        return new Quaternion(axis.x * s, axis.y * s, axis.z * s, c);
    }

    public static createLookAt(at: Vector3, lookAt: Vector3, up: Vector3 = Vector3.up): Quaternion {
        let zAxis = Vector3.subtract(at, lookAt);
        zAxis = Vector3.normalize(zAxis);

        const worldUpXDir = Vector3.cross(up, zAxis);

        const xAxis = Vector3.normalize(worldUpXDir);
        const yAxis = Vector3.cross(zAxis, xAxis);

        return Quaternion.fromAxis(xAxis, yAxis, zAxis);
    }

    public equals(other: Quaternion): boolean {
        if (this === other) {
            return true;
        }
        
        return this.x === other.x &&
               this.y === other.y &&
               this.z === other.z &&
               this.w === other.w;
    }
}