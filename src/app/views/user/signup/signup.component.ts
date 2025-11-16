import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthResponseType} from "../../../../types/auth-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnDestroy {

  signupForm;
  private _subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {

    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ])([а-яё]+)(\s[А-ЯЁ][а-яё]+)*$/)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
      agree: [false, [Validators.requiredTrue]]
    });
  }

  signup(): void {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.agree) {
      this._subscriptions.add(this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | AuthResponseType) => {

            let error = null;

            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const signupResponse = data as AuthResponseType;
            if (!signupResponse.accessToken || !signupResponse.refreshToken || !signupResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            //set tokens
            this.authService.setTokens(signupResponse.accessToken, signupResponse.refreshToken);
            this.authService.userId = signupResponse.userId;

            //set userName
            this.authService.setUserName();

            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        }))
    }
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
