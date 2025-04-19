import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  constructor(
    private fb: FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = String(this.route.snapshot.queryParams['resetToken']);
      if (this.token) {
        this.authService.verifyToken(this.token)
        const decodedToken: {username: string} = jwtDecode(this.token);

        if (decodedToken && decodedToken.username) {
          this.username = decodedToken.username;
          console.log('Username estratto dal token:', this.username);
        } else {
          console.error('Username non trovato nel token');
          this.responseError = "Token non valido: username mancante";
        }

      } else {
        this.responseError = "Token mancante. Impossibile reimpostare la password.";
      }
  }

  verifyToken(): void {
    this.authService.verifyToken(this.token).subscribe({
      next: (isValid) => {
        this.isValidToken = isValid;
        
        if (!isValid) {
          this.responseError = "Il token per il reset della password non è valido o è scaduto.";
        }
      },
      error: (error) => {
        console.error('Errore durante la verifica del token:', error);
        this.isValidToken = false;
        this.responseError = "Errore durante la verifica del token. Riprova più tardi.";
      }
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const password = this.changePasswordForm.value;
      
      this.authService.changePassword(this.username, password).subscribe({
        next: (response) => {
          this.responseForm = response.message
          this.isValidToken = false
        },
        error: (error) => {
          this.responseError = error.message
        }
      })
    }
  }
  

}
