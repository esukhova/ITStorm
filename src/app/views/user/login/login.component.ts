import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from "../../../core/auth/auth.service";
import {AuthResponseType} from "../../../../types/auth-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";
import {UserInfoType} from '../../../../types/userInfo.type';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {

  loginForm;
  private _subscriptions: Subscription = new Subscription()

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this._subscriptions.add(this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: AuthResponseType | DefaultResponseType) => {

            let error = null;

            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as AuthResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            //set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            //set userName
            this.authService.setUserName();

            this._snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        }));
    }
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
