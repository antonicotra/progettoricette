import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  dropdownOpen = false;
  logoutMessage: string | null = null;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        localStorage.removeItem('accessToken');
        this.logoutMessage = response.message;
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        this.logoutMessage = error.message
      }
    });
  }
}