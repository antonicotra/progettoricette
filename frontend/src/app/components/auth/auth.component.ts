import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';


@Component({
  selector: 'app-auth',
  imports: [LoginFormComponent, SignupFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  showLoginForm: boolean;

  constructor() {
    this.showLoginForm = true;
  }

  toggleForm(formType: string) {
    this.showLoginForm = formType === 'login';
  }

}
