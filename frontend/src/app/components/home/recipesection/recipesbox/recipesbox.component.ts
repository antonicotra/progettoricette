import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { RecipecardComponent } from './recipecard/recipecard.component';
import { RecipeService } from '../../../../services/recipe.service';
import { Recipe } from './../../../../models/recipe.model';
import { CategoryFilterService } from '../../../../services/categoryfilter.service';

@Component({
  selector: 'app-recipesbox',
  imports: [RecipecardComponent],
  templateUrl: './recipesbox.component.html',
  styleUrl: './recipesbox.component.css'
})
export class RecipesboxComponent {

  private readonly recipesService = inject(RecipeService);
  private readonly categoryFilterService = inject(CategoryFilterService);
  public recipes = signal<Recipe[]>([]);
  public currentPage = signal(0);
  public isLoading = signal(false);
  public hasMoreData = signal(true);
  public currentCategory = signal<string | null>(null);

  constructor() {
    effect(() => {
      const selectedCategory = this.categoryFilterService.selectedCategory();
      if (selectedCategory !== this.currentCategory()) {
        this.currentCategory.set(selectedCategory!);
        
        this.recipes.set([]);
        this.currentPage.set(0);
        this.hasMoreData.set(true);
        this.loadRecipes();
      }
    });
  }

  public ngOnInit(): void {
    this.loadRecipes();
  }

  public loadRecipes(): void {
    if(this.isLoading() || !this.hasMoreData()) return;
    
    this.isLoading.set(true);
    
    this.recipesService.getRecipes(Number(this.currentPage()), this.currentCategory() || undefined).subscribe({
      next: (newRecipes) => {
        if(newRecipes.length === 0) {
          this.hasMoreData.set(false);
        } else {
          this.recipes.update(recipes => [...recipes, ...newRecipes]);
          this.currentPage.update(page => page + 1);
        }
        this.isLoading.set(false);
      }
    });
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