export interface ReplicationCreateAction {
    action: 'create';
    refId: string;
    className: string;
    properties: {
        [key: string]: any;
    };
}
