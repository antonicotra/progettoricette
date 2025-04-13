import { Component, effect, inject } from '@angular/core';
import { CategorybuttonComponent } from './categorybutton/categorybutton.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CategorySelectedService } from '../../../services/categoryselected.service';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-categoriesbox',
  imports: [CategorybuttonComponent],
  templateUrl: './categoriesbox.component.html',
  styleUrl: './categoriesbox.component.css'
})

export class CategoriesboxComponent {

  private readonly categoriesService = inject(CategoryService)
  private readonly recipeService = inject(RecipeService)
  private readonly categoryselectedService = inject(CategorySelectedService);
  public categories: Category[] = []
  public isLoading: boolean = true
  public errorMessage = ""

  constructor() {
    effect(() => {
      const nameMeal = this.recipeService.nameMeal()
      if(nameMeal != "") {
        this.categories.forEach(category => {
          if (category.isActive) {
            category.isActive = false;
          }
        });
      }
    })
  }

  public ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      
      next: (response: {accessToken: string, categories: Category[]}) => {
        this.categories = response.categories!
        if(this.recipeService.nameMeal() == "") {
          const savedCategory = this.categoryselectedService.selectedCategory();
          const activeCategory = response.categories!.find(cat => cat.categoryName === savedCategory);
          if (activeCategory) {
            activeCategory.isActive = true;
          } else if (response.categories!.length > 0) {
            response.categories![0].isActive = true;
            this.categoryselectedService.setSelectedCategory(savedCategory);
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message
        this.isLoading = false
      }
    })
  }

  public onClick(category: Category): void  {
    if(category.isActive == true) return
    this.recipeService.setNameMeal("")

    this.categories.forEach(category => {
      if (category.isActive) {
        category.isActive = false;
      }
    });
    category.isActive = true
    this.categoryselectedService.setSelectedCategory(category.categoryName)
  }

}
