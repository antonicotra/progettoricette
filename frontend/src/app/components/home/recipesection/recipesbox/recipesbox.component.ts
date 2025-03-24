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

  constructor() {
    if(!this.recipesService.nameMeal()) {
      this.resetAndLoadByCategory(this.categorySelectedService.selectedCategory())
    }

    if(this.recipesService.nameMeal()) {
      this.resetAndLoadByName(this.recipesService.nameMeal())
    }

    effect(() => {
      const selectedCategory = this.categorySelectedService.selectedCategory()
      untracked(() => {
        if(this.categorySelectedService.previousCategory != selectedCategory) {
          this.resetAndLoadByCategory(selectedCategory)
        }
      })
    })

    effect(() => {
      const nameMeal = this.recipesService.nameMeal()
      untracked(() => {
        this.resetAndLoadByName(nameMeal)
      })
    })
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

  public loadRecipes(): void {
    if(!this.recipesService.nameMeal()) {
      this.loadRecipesWithCategory(this.categorySelectedService.selectedCategory())
    }

    if(this.recipesService.nameMeal()) {
      this.loadRecipesFilteredByName(this.recipesService.nameMeal())
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