import { Component, effect, HostListener, inject, signal, untracked } from '@angular/core';
import { RecipecardComponent } from './recipecard/recipecard.component';
import { RecipeService } from '../../../../services/recipe.service';
import { Recipe } from './../../../../models/recipe.model';
import { CategorySelectedService } from '../../../../services/categoryselected.service';

@Component({
  selector: 'app-recipesbox',
  imports: [RecipecardComponent],
  templateUrl: './recipesbox.component.html',
  styleUrl: './recipesbox.component.css'
})
export class RecipesboxComponent {

  private readonly recipesService = inject(RecipeService);
  private readonly categorySelectedService = inject(CategorySelectedService);
  public recipes = signal<Recipe[]>([]);
  public currentPage = signal(0);
  public isLoading = signal(false);
  public hasMoreData = signal(true);
  private lastCategory = signal<string | null>(null);
  private lastMealName = signal<string | null>(null);
  private searchByName = signal<boolean>(false);

  ngOnInit() {
    localStorage.removeItem('name')
  }
  
  constructor() {

    const storedMealName = localStorage.getItem('name');
    if (storedMealName) {
      this.lastMealName.set(storedMealName);
      this.recipesService.setNameMeal(storedMealName);
      this.searchByName.set(true);
      this.resetAndLoadByName(storedMealName);
    }

    effect(() => {
      const category = this.categorySelectedService.selectedCategory();
      
      if (this.lastCategory() !== null && category !== this.lastCategory()) {
        untracked(() => {
          if(this.searchByName()) {
            this.recipesService.setNameMeal('');
            this.searchByName.set(false);
          }
          this.resetAndLoadByCategory(category);
        });
      } else if (this.lastCategory() === null) {
        untracked(() => {
          this.resetAndLoadByCategory(category);
        });
      }
      this.lastCategory.set(category);
    });
    
    effect(() => {
      const mealName = this.recipesService.nameMeal();
      
      if (mealName !== this.lastMealName()) {
        untracked(() => {
          if (mealName && mealName.trim() !== '') {
            this.searchByName.set(true);
            this.resetAndLoadByName(mealName);
          } else if (this.lastMealName() && this.lastMealName()!.trim() !== '') {
            this.searchByName.set(false);
            const category = this.categorySelectedService.selectedCategory();
            this.resetAndLoadByCategory(category);
          }
        });
      }
      this.lastMealName.set(mealName);
    });
  }

  private resetAndLoadByCategory(category: string): void {
    this.recipes.set([]);
    this.currentPage.set(0);
    this.hasMoreData.set(true);
    this.loadRecipesWithCategory(category);
  }
  
  private resetAndLoadByName(name: string): void {
    this.recipes.set([]);
    this.currentPage.set(0);
    this.hasMoreData.set(true);
    this.loadRecipesFilteredByName(name);
  }

  private loadRecipesWithCategory(category: string): void {
    if (this.isLoading() || !this.hasMoreData()) return;
    
    this.isLoading.set(true);
    
    this.recipesService.getRecipes(Number(this.currentPage()), category).subscribe({
      next: (newRecipes) => {
        if (newRecipes.length === 0) {
          this.hasMoreData.set(false);
        } else {
          this.recipes.update(recipes => [...recipes, ...newRecipes]);
          this.currentPage.update(page => page + 1);
        }
        this.isLoading.set(false);
      }
    });
  }

  private loadRecipesFilteredByName(name: string): void {
    if (this.isLoading() || !this.hasMoreData()) return;
    
    this.isLoading.set(true);
    
    this.recipesService.getRecipesFiltered(Number(this.currentPage()), name).subscribe({
      next: (newRecipes) => {
        if (newRecipes.length === 0) {
          this.hasMoreData.set(false);
        } else {
          this.recipes.update(recipes => [...recipes, ...newRecipes]);
          this.currentPage.update(page => page + 1);
        }
        this.isLoading.set(false);
      }
    });
  }

  public loadRecipes(): void {
    
    if (this.searchByName()) {
      const name = this.recipesService.nameMeal();
      this.loadRecipesFilteredByName(name);
    } else {
      const category = this.categorySelectedService.selectedCategory();
      this.loadRecipesWithCategory(category);
    }
  }

  @HostListener('window:scroll',[])
  onScroll(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
    if (windowHeight + scrollTop >= documentHeight - 100) {
      this.loadRecipes();
    }
  }
}