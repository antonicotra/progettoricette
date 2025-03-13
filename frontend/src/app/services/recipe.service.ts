import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly http: HttpClient = inject(HttpClient);
  private baseUrl = "http://localhost:3000/recipes";
  private recipesPerPage = "3";

  public getRecipes(page: number, category?: string): Observable<Recipe[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', this.recipesPerPage);
    
    if (category && category !== "All") {
      params = params.set('category', category);
    }
  
    return this.http.get<Recipe[]>(this.baseUrl, { params });
  }
}