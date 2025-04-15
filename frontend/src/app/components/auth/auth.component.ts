import { Component, inject } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-auth',
  imports: [LoginFormComponent, SignupFormComponent, ResetPasswordModalComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  showLoginForm: boolean;
  public modalService = inject(ModalService);

  constructor() {
    this.showLoginForm = true;
  }

  toggleForm(formType: string) {
    this.showLoginForm = formType === 'login';
  }

}
