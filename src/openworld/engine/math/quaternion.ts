import Vector3, { IVector3 } from './vector3';
import MathEx from './mathex';

export interface IQuaternion {
    x: number;
    y: number;
    z: number;
    w: number;
}

export default class Quaternion 
{
    public static readonly identity = new Quaternion(0, 0, 0, 1);
    public static readonly one = new Quaternion(1, 1, 1, 1);

    //
    // Constructor
    //

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

    public static fromEulerAngles(yaw: number, pitch: number, roll: number): Quaternion {
        const rollAngle = roll * 0.5;
        const rollSin = Math.sin(rollAngle);
        const rollCos = Math.cos(rollAngle);

        const pitchAngle = pitch * 0.5;
        const pitchSin = Math.sin(pitchAngle);
        const pitchCos = Math.cos(pitchAngle);

        const yawAngle = yaw * 0.5;
        const yawSin = Math.sin(yawAngle);
        const yawCos = Math.cos(yawAngle);

        const yawCosXpitchSin = yawCos * pitchSin;
        const yawSinXpitchCos = yawSin * pitchCos;
        const yawCosXpitchCos = yawCos * pitchCos;
        const yawSinXpitchSin = yawSin * pitchSin;

        return new Quaternion(
            (yawCosXpitchSin * rollCos) + (yawSinXpitchCos * rollSin),
            (yawSinXpitchCos * rollCos) - (yawCosXpitchSin * rollSin),
            (yawCosXpitchCos * rollSin) - (yawSinXpitchSin * rollCos),
            (yawCosXpitchCos * rollCos) + (yawSinXpitchSin * rollSin)
        );
    }

    public static fromAxis(xAxis: IVector3, yAxis: IVector3, zAxis: IVector3): Quaternion {
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

    public static fromAxisAngle(axis: IVector3, angle: number): Quaternion {
        const halfAngle = angle * 0.5;
        const s = Math.sin(halfAngle);
        const c = Math.cos(halfAngle);

        return new Quaternion(axis.x * s, axis.y * s, axis.z * s, c);
    }

    public static createLookAt(at: IVector3, lookAt: IVector3, up: IVector3 = Vector3.up): Quaternion {
        let zAxis = Vector3.subtract(at, lookAt);
        zAxis = Vector3.normalize(zAxis);

        const worldUpXDir = Vector3.cross(up, zAxis);

        const xAxis = Vector3.normalize(worldUpXDir);
        const yAxis = Vector3.cross(zAxis, xAxis);

        return Quaternion.fromAxis(xAxis, yAxis, zAxis);
    }
    
    public toEulerAngles(): Vector3 {
        let yaw: number;
        let pitch: number;
        let roll: number;

        const test = (this.x * this.y) + (this.z * this.w);        
        if(test > 0.499)
        {
            // North pole singularity
            yaw = 2.0 * Math.atan2(this.x, this.w);
            pitch = 0.0;
            roll = MathEx.piOverTwo;
        } else if(test < -0.499) {
            // South pole singularity
            yaw = -2.0 * Math.atan2(this.x, this.w);
            pitch = 0.0;
            roll = -MathEx.piOverTwo;
        } else {
            const xx = this.x * this.x;
            const yy = this.y * this.y;
            const zz = this.z * this.z;

            yaw = Math.atan2(
                (2.0 * this.y * this.w) - (2.0 * this.x * this.z),
                1.0 - (2.0 * yy) - (2.0 * zz)
            );

            pitch = Math.atan2(
                (2.0 * this.x * this.w) - (2.0 * this.y * this.z),
                1.0 - (2.0 * xx) - (2.0 * zz)
            );

            roll = Math.asin(2.0 * test);
        }

        if(MathEx.isApproxZero(yaw)) {
            yaw = 0.0;
        }

        if(MathEx.isApproxZero(pitch)) {
            pitch = 0.0;
        }

        if(MathEx.isApproxZero(roll)) {
            roll = 0.0;
        }

        return new Vector3(yaw, pitch, roll);
    }

    public clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    public equals(other: IQuaternion): boolean {
        if (this === other) {
            return true;
        }
        
        return this.x === other.x &&
               this.y === other.y &&
               this.z === other.z &&
               this.w === other.w;
    }
}