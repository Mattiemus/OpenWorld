import AccountDataService from "./data-services/account-data-service";
import ProjectDataService from "./data-services/project-data-service";

export default class EditorServiceContainer {
    private _accountDataService = new AccountDataService();
    private _projectDataService = new ProjectDataService();    

    public get accountDataService(): AccountDataService {
        return this._accountDataService;
    }

    public get projectDataService(): ProjectDataService {
        return this._projectDataService;
    }
}