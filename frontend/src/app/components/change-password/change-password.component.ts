import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})

export class ChangePasswordComponent {

  changePasswordForm: FormGroup;
  public responseForm = ""
  public responseError = ""
  public token = '';
  public username = '';
  isValidToken = false;
  isLoading = true; 
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  constructor(
    private fb: FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.token = String(this.route.snapshot.queryParams['resetToken'] || '');
    
    if (this.token) {
      try {
        const decodedToken: {username: string} = jwtDecode(this.token);
        
        if (decodedToken && decodedToken.username) {
          this.username = decodedToken.username;
          
          this.verifyToken();
        } else {
          this.responseError = "Invalid token: username missing";
          this.isLoading = false;
        }
      } catch (error) {
        this.responseError = "Error reading token";
        this.isLoading = false;
      }
    } else {
      this.responseError = "Token missing. Unable to reset password.";
      this.isLoading = false;
    }
  }

  verifyToken(): void {
    this.authService.verifyToken(this.token).subscribe({
      next: (isValid) => {
        this.isValidToken = isValid;
        this.isLoading = false;
        
        if (!isValid) {
          this.responseError = "Password reset token is invalid or expired.";
        }
      },
      error: (error) => {
        console.error('Error while verifying token:', error);
        this.isValidToken = false;
        this.isLoading = false;
        this.responseError = "Error while verifying token. Please try again later.";
      }
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const password = this.changePasswordForm.value.password;
      
      this.authService.changePassword(this.username, password).subscribe({
        next: (response) => {
          this.responseForm = response.message;
          this.isValidToken = false;
        },
        error: (error) => {
          this.responseError = error.error?.message || error.message || "Error while updating password";
        }
      });
    }
  }

  clearError(): void {
    this.responseError = '';
  }

  clearSuccess(): void {
    this.responseForm = '';
  }
}