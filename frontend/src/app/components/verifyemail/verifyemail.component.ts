import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'app-verifyemail',
  imports: [CommonModule,RouterModule],
  templateUrl: './verifyemail.component.html',
  styleUrl: './verifyemail.component.css'
})
export class VerifyemailComponent {

  private readonly authService = inject(AuthService)
  private readonly route = inject(ActivatedRoute);
  statusMessage = '';
  success = false;

  ngOnInit(): void {
    const verifyToken = this.route.snapshot.queryParamMap.get('token');
    
    if (verifyToken) {
      this.authService.verifyEmail(verifyToken).subscribe({
        next: (response) => {
          this.success = true;
          this.statusMessage = response.message;
        },
        error: (error) => {
          this.success = false;
          console.log(error)
          this.statusMessage = error.message || 'Verification failed. Please try again.';
        }
      });
    } else {
      this.statusMessage = 'Invalid or missing verification token.';
      this.success = false;
    }
  }

 }
