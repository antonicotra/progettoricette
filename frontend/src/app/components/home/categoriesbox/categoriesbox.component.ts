import { Component, inject } from '@angular/core';
import { CategorybuttonComponent } from './categorybutton/categorybutton.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CategoryFilterService } from '../../../services/categoryfilter.service';

@Component({
  selector: 'app-categoriesbox',
  imports: [CategorybuttonComponent],
  templateUrl: './categoriesbox.component.html',
  styleUrl: './categoriesbox.component.css'
})

export class CategoriesboxComponent {

  private readonly categoriesService = inject(CategoryService)
  private readonly categoryfilterService = inject(CategoryFilterService);
  public categories: Category[] = []
  public isLoading: boolean = true

  public ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories
      this.categories[0].isActive = true
      this.categoryfilterService.setSelectedCategory(categories[0].categoryName)
      this.isLoading = false;
    })
  }

  public onClick(category: Category): void  {

    if(category.isActive == true) return

    this.categories.forEach(category => {
      if (category.isActive) {
        category.isActive = false;
      }
    });
    category.isActive = true
    this.categoryfilterService.setSelectedCategory(category.categoryName)
  }

}
