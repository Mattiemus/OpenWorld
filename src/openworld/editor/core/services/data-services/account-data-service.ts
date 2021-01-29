import Account from "../../models/account";
import { BehaviorSubject, Observable } from 'rxjs';

export default class AccountDataService {
    private _currentAccount$ = new BehaviorSubject<Account | null>(null);

    public getCurrentAccount(): Account | null {
        return this._currentAccount$.value;
    }
    
    public getCurrentAccount$(): Observable<Account | null> {
        return this._currentAccount$.asObservable();
    }
}