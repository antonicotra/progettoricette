import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  loginForm: FormGroup;
  loginError: string = '';

  private readonly authService = inject(AuthService)
  private readonly modalService = inject(ModalService);

  constructor(
    private fb: FormBuilder, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          this.router.navigate(['/homepage']);
        },
        error: (error) => {
          this.loginError = error.message;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  clearError() {
    this.loginError = "";
  }

  openResetPasswordModal(event: Event) {
    event.preventDefault();
    this.modalService.openResetPasswordModal();
  }
}
