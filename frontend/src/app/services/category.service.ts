import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Category } from "../models/category.model"

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private readonly http: HttpClient = inject(HttpClient)

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>("http://localhost:3000/categories")
  }
}
