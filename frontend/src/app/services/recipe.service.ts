import { effect, inject, Injectable, signal } from '@angular/core';
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
  private nameMealSignal = signal<string>(
      localStorage.getItem('name') || ""
    );

  public nameMeal = this.nameMealSignal.asReadonly();
  
  setNameMeal(name: string) {
      this.nameMealSignal.set(name);
      localStorage.setItem('name', this.nameMeal());
  }
  
  public getRecipes(page: number, category?: string): Observable<Recipe[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', this.recipesPerPage);
    
    if (category && category !== "All") params = params.set('category', category);
  
    return this.http.get<Recipe[]>(this.baseUrl, { params });
  }

  public getRecipesFiltered(page: number, name: string): Observable<Recipe[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', this.recipesPerPage)
      .set('name', name)
  
    return this.http.get<Recipe[]>(this.baseUrl, { params });
  }
}