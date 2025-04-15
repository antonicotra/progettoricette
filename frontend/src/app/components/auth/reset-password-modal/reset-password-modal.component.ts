import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password-modal.component.html',
  styleUrl: './reset-password-modal.component.css'
})
export class ResetPasswordModalComponent {

  resetPasswordForm: FormGroup;
  public modalService = inject(ModalService);
  public authService = inject(AuthService);
  public responseForm = ""
  public responseError = ""

    constructor(
      private fb: FormBuilder
    ) {
      this.resetPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }

    onSubmit(): void {
      if (this.resetPasswordForm.valid) {
        const email = this.resetPasswordForm.value;
        
      this.authService.sendResetPassword(email).subscribe({
          next: (response) => {
            this.responseForm = response.message
          },
          error: (error) => {
            this.responseError = error.message
          }
        });
      } else {
        this.resetPasswordForm.markAllAsTouched();
      }
    }

    cancel() {
      this.resetPasswordForm.reset();
      this.modalService.closeResetPasswordModal();
    }

}
