import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  username?: string;
  // altri campi possibili
}

@Component({
  selector: 'app-change-password',
  standalone: true, // Aggiungi questa proprietà se il componente è standalone
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})

export class ChangePasswordComponent implements OnInit {  // Implementa OnInit

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
        // Decodifica il token per estrarre lo username
        const decodedToken = jwtDecode<MyTokenPayload>(this.token);
        
        if (decodedToken && decodedToken.username) {
          this.username = decodedToken.username;
          console.log('Username estratto dal token:', this.username);
          
          // Verifica il token SOTTOSCRIVENDOTI all'Observable
          this.verifyToken();
        } else {
          console.error('Username non trovato nel token');
          this.responseError = "Token non valido: username mancante";
          this.isLoading = false;
        }
      } catch (error) {
        console.error('Errore durante la decodifica del token:', error);
        this.responseError = "Errore nella lettura del token";
        this.isLoading = false;
      }
    } else {
      this.responseError = "Token mancante. Impossibile reimpostare la password.";
      this.isLoading = false;
    }
  }

  verifyToken(): void {
    this.authService.verifyToken(this.token).subscribe({
      next: (isValid) => {
        this.isValidToken = isValid;
        this.isLoading = false;
        
        if (!isValid) {
          this.responseError = "Il token per il reset della password non è valido o è scaduto.";
        }
      },
      error: (error) => {
        console.error('Errore durante la verifica del token:', error);
        this.isValidToken = false;
        this.isLoading = false;
        this.responseError = "Errore durante la verifica del token. Riprova più tardi.";
      }
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const password = this.changePasswordForm.value.password; // Accedi direttamente alla proprietà password
      
      this.authService.changePassword(this.username, password).subscribe({
        next: (response) => {
          this.responseForm = response.message;
          this.isValidToken = false;
        },
        error: (error) => {
          this.responseError = error.error?.message || error.message || "Errore durante l'aggiornamento della password";
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