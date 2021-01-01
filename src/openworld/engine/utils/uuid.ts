function createRandomUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
  }

export default class Uuid
{
    private readonly _uuid: string;

    //
    // Constructor
    //

    constructor(uuid?: string) {
        if (uuid === undefined) {
            uuid = createRandomUuid();
        }

        this._uuid = uuid;
    }

    //
    // Methods
    //

    public toString(): string {
        return this._uuid;
    }

    public equals(other: Uuid): boolean {
        return this._uuid === other._uuid;
    }
}