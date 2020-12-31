import Uuid from "../../utils/uuid";

import * as _ from "lodash";

export default class Content
{
    private readonly _contentId: Uuid;

    //
    // Constructor
    //

    constructor(contentId: string | Uuid) {
        if (_.isString(contentId)) {
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

    public equals(other: Content): boolean {
        return this._contentId === other._contentId || this._contentId.equals(other._contentId);
    }
}