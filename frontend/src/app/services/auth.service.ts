import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private readonly http: HttpClient = inject(HttpClient)

  public login(email: string, password: string) {
    return this.http.post<{accessToken: string}>("https://progettoricette-production.up.railway.app/auth/login", {email, password}, {withCredentials: true})
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
    return this.http.post<{id: string, username: string, email: string}>("https://progettoricette-production.up.railway.app/auth/signup", {email, password, username})
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

  public logout() {
    return this.http.post<{message: string}>('https://progettoricette-production.up.railway.app/auth/logout', {}, { withCredentials: true })
    .pipe(
      catchError((error: HttpErrorResponse) => {
          let errorMessage: string
          if (error) {
            errorMessage = error.error.message;
          }
          return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  public verifyToken(verifyToken: string) {
    return this.http.get<boolean>(
      `https://progettoricette-production.up.railway.app/auth/verify-reset-token?resetToken=${verifyToken}`
    ).pipe(
      catchError(error => {
        console.error('Errore durante la verifica del token', error);
        return of(false);
      })
    );
  }

  public verifyEmail(verifyToken: string) {

    return this.http.get<{message: string}>(`https://progettoricette-production.up.railway.app/auth/verify-email?token=${verifyToken}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
          let errorMessage: string
          if (error) {
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
      
    return this.http.get<{accessToken: string}>("https://progettoricette-production.up.railway.app/auth/me", {
      headers, 
      withCredentials: true
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public sendResetPassword(email: string) {
    return this.http.post<{message: string}>("https://progettoricette-production.up.railway.app/auth/send-reset-email", email)
    .pipe(
      catchError((error: HttpErrorResponse) => {
          let errorMessage: string
          if (error) {
            errorMessage = error.error[0].message;
          }
          return throwError(() => ({ message: errorMessage }));
      })
    )
  }

  public changePassword(username: string, password: string) {
    return this.http.post<{message: string}>(`https://progettoricette-production.up.railway.app/auth/change-password?username=${username}`,{password})
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

}
