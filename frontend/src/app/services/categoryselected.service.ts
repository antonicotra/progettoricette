import {Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategorySelectedService {
  private selectedCategorySignal = signal<string>(
    localStorage.getItem('selectedCategory') || "All"
  );

  public previousCategory: string | null = null
  public selectedCategory = this.selectedCategorySignal.asReadonly();

  setSelectedCategory(category: string) {
    this.previousCategory = this.selectedCategory()
    this.selectedCategorySignal.set(category);
    localStorage.setItem('selectedCategory', this.selectedCategory());
  }
}
