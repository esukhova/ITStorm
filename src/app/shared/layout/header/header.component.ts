import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: false,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {

    isLogged: boolean = false;
    userName: string = "Пользователь";
    isMobileMenuOpen = false;
    private _subscriptions: Subscription = new Subscription();

    constructor(private authService: AuthService,
                private _snackBar: MatSnackBar,
                private router: Router) {
        this.isLogged = this.authService.getIsLoggedIn();
    }

    ngOnInit() {
        if (localStorage.getItem("userName")) {
            this.userName = localStorage.getItem("userName")!;
        }
        this._subscriptions.add(this.authService.userName$.subscribe((userName: string) => {
            this.userName = userName;
        }));
        this._subscriptions.add(this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
            this.isLogged = isLoggedIn;
        }));
    }

    logout(): void {
        this._subscriptions.add(this.authService.logout()
            .subscribe({
                next: () => {
                    this.doLogout();
                },
                error: () => {
                    this.doLogout();
                }
            }));
    }

    doLogout(): void {
        this.authService.removeTokens();
        this.authService.removeUserName();
        this.authService.userId = null;
        this._snackBar.open('Вы вышли из системы');
        this.router.navigate(['/']);
        this.userName = 'Пользователь';
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        document.body.style.height = this.isMobileMenuOpen ? '100vh' : '';
        document.body.style.overflowY = this.isMobileMenuOpen ? 'hidden' : '';
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }
}
