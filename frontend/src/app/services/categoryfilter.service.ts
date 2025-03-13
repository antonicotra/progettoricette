import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryFilterService {
  private selectedCategorySignal = signal<string | undefined>("All");
  public selectedCategory = this.selectedCategorySignal.asReadonly();

  setSelectedCategory(category: string) {
    this.selectedCategorySignal.set(category);
  }
}
