import Uuid from "../../utils/uuid";
import { isString } from "../../utils/type-guards";

export default class Content
{
    private readonly _contentId: Uuid;

    //
    // Constructor
    //

    constructor(contentId: string | Uuid) {
        if (isString(contentId)) {
            this._contentId = new Uuid(contentId);
        } else {
            this._contentId = contentId;
        }
    }

    //
    // Properties
    //

    public get id(): Uuid {
        return this._contentId;
    }

    //
    // Methods
    //

    public toString(): string {
        return this._contentId.toString();
    }

    public equals(other: Content): boolean {
        return this._contentId === other._contentId || this._contentId.equals(other._contentId);
    }
}