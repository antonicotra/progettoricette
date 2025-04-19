import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Category } from "../models/category.model"

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private readonly http: HttpClient = inject(HttpClient)

  public getCategories() {
    
    const headers = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem('accessToken')}`});
  
    return this.http.get<{accessToken: string, categories: Category[]}>("/api/categories", {headers, withCredentials: true});
  }
}
