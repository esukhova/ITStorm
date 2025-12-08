import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject, Subscription, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {AuthResponseType} from "../../../types/auth-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserInfoType} from '../../../types/userInfo.type';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {

    public accessTokenKey: string = 'accessToken';
    public refreshTokenKey: string = 'refreshToken';
    public userIdKey = 'userId';

    public isLogged$: Subject<boolean> = new Subject<boolean>();
    private _isLogged: boolean = false;

    public userName$: Subject<string> = new Subject<string>();

    private _subscriptions: Subscription = new Subscription();

    constructor(private http: HttpClient) {
        this._isLogged = !!localStorage.getItem(this.accessTokenKey);
        setTimeout(() => {
            this.checkAuthStatus();
        });
    }

    private checkAuthStatus(): void {
        const tokens = this.getTokens();
        if (tokens.accessToken) {
            this._subscriptions.add(this.getUserInfo().subscribe({
                next: (userInfo) => {
                    this._isLogged = true;
                    this.isLogged$.next(true);
                    this.setUserName();
                },
                error: () => {
                    this.removeTokens();
                    this._isLogged = false;
                    this.isLogged$.next(false);
                }
            }));
        } else {
            this._isLogged = false;
            this.isLogged$.next(false);
        }
    }

    getUserInfo(): Observable<DefaultResponseType | UserInfoType> {
        return this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users');
    }

    login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | AuthResponseType> {
        return this.http.post<DefaultResponseType | AuthResponseType>(environment.api + 'login', {
            email,
            password,
            rememberMe
        })
    }

    signup(name: string, email: string, password: string): Observable<DefaultResponseType | AuthResponseType> {
        return this.http.post<DefaultResponseType | AuthResponseType>(environment.api + 'signup', {
            name,
            email,
            password
        })
    }

    logout(): Observable<DefaultResponseType> {
        const tokens = this.getTokens();
        if (tokens && tokens.refreshToken) {
            return this.http.post<DefaultResponseType>(environment.api + 'logout', {
                refreshToken: tokens.refreshToken
            })
        }

        throw throwError(() => 'Can not find token');
    }

    refresh(): Observable<DefaultResponseType | AuthResponseType> {
        const tokens = this.getTokens();
        if (tokens && tokens.refreshToken) {
            return this.http.post<DefaultResponseType | AuthResponseType>(environment.api + 'refresh', {
                refreshToken: tokens.refreshToken
            })
        }

        throw throwError(() => 'Can not use token')
    }

    public getIsLoggedIn() {
        return this._isLogged;
    }

    public setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        this._isLogged = true;
        this.isLogged$.next(true);
    }

    public removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        this._isLogged = false;
        this.isLogged$.next(false);
    }

    public removeUserName(): void {
        localStorage.removeItem("userName");
        this.userName$.next("");
    }

    public getTokens(): { accessToken: string | null, refreshToken: string | null } {
        return {
            accessToken: localStorage.getItem(this.accessTokenKey),
            refreshToken: localStorage.getItem(this.refreshTokenKey)
        }
    }

    get userId(): null | string {
        return localStorage.getItem(this.userIdKey);
    }

    set userId(id: string | null) {
        if (id) {
            localStorage.setItem(this.userIdKey, id);
        } else {
            localStorage.removeItem(this.userIdKey);
        }
    }

    setUserName() {
        this._subscriptions.add(this.getUserInfo()
            .subscribe((data: UserInfoType | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                    throw new Error((data as DefaultResponseType).message);
                }
                localStorage.setItem('userName', (data as UserInfoType).name);
                this.userName$.next((data as UserInfoType).name);
            }))
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }
}
