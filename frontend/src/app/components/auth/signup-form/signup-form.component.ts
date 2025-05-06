import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent {

  signupForm: FormGroup;
  signupError = ''
  signupMessage = ''


  private readonly authService = inject(AuthService)
  
  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }


  onSubmit(): void {
    if (this.signupForm.valid) {
      const { email, password, username} = this.signupForm.value;
      
      this.authService.signup(email, password, username).subscribe({
        next: (response) => {
          this.signupMessage = "A confirmation email has been sent to " + response.email
          this.signupError = ''
          this.signupForm.reset();
        },
        error: (error) => {
          this.signupError = error.message;
          this.signupMessage = ''
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  clearMessage() {
    if(this.signupError) this.signupError = "";
    if(this.signupMessage) this.signupMessage = "";
  }
}
