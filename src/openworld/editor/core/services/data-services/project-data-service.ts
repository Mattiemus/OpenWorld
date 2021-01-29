import Project from "../../models/project";
import { BehaviorSubject, Observable } from 'rxjs';

export default class ProjectDataService {
    private _currentProject$ = new BehaviorSubject<Project | null>(null);

    public getCurrentProject(): Project | null {
        return this._currentProject$.value;
    }

    public getCurrentProject$(): Observable<Project | null> {
        return this._currentProject$.asObservable();
    }

    public setCurrentProject(project: Project): void {
        this._currentProject$.next(project);
    }
}