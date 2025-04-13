import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private readonly http: HttpClient = inject(HttpClient)

  public login(email: string, password: string) {
    return this.http.post<{accessToken: string}>("http://localhost:3000/auth/login", {email, password}, {withCredentials: true})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;

        if (error.error) {
          errorMessage = error.error.message;
        }
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  public signup(email: string, password: string, username: string) {
    return this.http.post<{id: string, username: string, email: string}>("http://localhost:3000/auth/signup", {email, password, username})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;

        if (Array.isArray(error.error)) {
          errorMessage = error.error.reduce((acc, current, index) => {
            return acc + (index > 0 ? '\n' : '') + current.message;
          }, '');
        } else {
          errorMessage = error.error.message;
        }

        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  public isAuthenticated() {
    if (!localStorage.getItem('accessToken')) {
      return of(false);
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    
    return this.http.get<{accessToken: string}>("http://localhost:3000/auth/me", {
      headers, 
      withCredentials: true
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

}
