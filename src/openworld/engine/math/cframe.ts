import { Vector3 } from "./vector3";
import { Quaternion } from './quaternion';

export class CFrame
{
    public static readonly identity = new CFrame(0, 0, 0, 0, 0, 0, 1);

    constructor(        
        public readonly x: number,
        public readonly y: number,
        public readonly z: number,
        public readonly qx: number,
        public readonly qy: number,
        public readonly qz: number,
        public readonly qw: number)
    {
        // No-op    
    }

    //
    // Properties
    //

    public get position(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    public get rotation(): Quaternion {
        return new Quaternion(this.qx, this.qy, this.qz, this.qw);
    }

    // 
    // Methods
    //

    public static fromPosition(position: Vector3): CFrame {
        return new CFrame(position.x, position.y, position.z, 0, 0, 0, 1);
    }

    public static fromRotation(rotation: Quaternion): CFrame {
        return new CFrame(0, 0, 0, rotation.x, rotation.y, rotation.z, rotation.w);
    }

    public static createLookAt(at: Vector3, lookAt: Vector3, up: Vector3 = Vector3.up): CFrame {
        const rotation = Quaternion.createLookAt(at, lookAt, up);
        return new CFrame(at.x, at.y, at.z, rotation.x, rotation.y, rotation.z, rotation.w);
    }
}
