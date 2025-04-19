import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  private readonly http: HttpClient = inject(HttpClient);
  private baseUrl = "/api/recipes";
  private recipesPerPage = "3";
  private nameMealSignal = signal<string>(
      localStorage.getItem('name') || ""
  );

  public nameMeal = this.nameMealSignal.asReadonly();
  
  setNameMeal(name: string) {
      this.nameMealSignal.set(name);
      localStorage.setItem('name', this.nameMeal());
  }
  
  public getRecipes(page: number, category?: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', this.recipesPerPage);
    
    if (category && category !== "All") params = params.set('category', category);

    const headers = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem('accessToken')}`});
  
    return this.http.get<{accessToken: string, recipes: Recipe[]}>(this.baseUrl, { headers,params, withCredentials: true });
  }

  public getRecipesFiltered(page: number, name: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', this.recipesPerPage)
      .set('name', name)

    const headers = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem('accessToken')}`});
  
    return this.http.get<{accessToken: string, recipes: Recipe[]}>(this.baseUrl, { headers,params, withCredentials: true});
  }
}