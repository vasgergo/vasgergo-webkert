import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";
import {UserService} from "../../shared/services/user/user.service";
import {confirmPasswordValidator} from "../../shared/validators/confirm-password.validator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {
  }

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
  }, {validators: confirmPasswordValidator});

  onSubmit() {
    this.authService.signup(this.signUpForm.get('email')?.value as string, this.signUpForm.get('password')?.value as string)
      .then((res) => {
        console.log('AUTH: Signup successful', res);
        const user: User = {
          id: res.user?.uid as string,
          username: this.signUpForm.get('username')?.value as string,
          email: this.signUpForm.get('email')?.value as string,
        }
        this.userService.create(user)
          .then(() => {
            console.log('User added to DB', user);
          })
          .catch((err) => {
            console.log('User NOT added to DB', err);
          });
        this.userService.setSignedInUser(res.user?.uid as string);
        this.router.navigate(['/']);

      })
      .catch((err) => {
        console.log('AUTH: Signup failed', err);
        //if email already exists
        if (err.code === 'auth/email-already-in-use') {
          this.signUpForm.get('email')?.setErrors({emailInUse: true});
        }
      });

  }


}
