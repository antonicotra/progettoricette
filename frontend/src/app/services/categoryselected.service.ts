import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategorySelectedService {
  private selectedCategorySignal = signal<string>(
    localStorage.getItem('selectedCategory') || "All"
  );
  public selectedCategory = this.selectedCategorySignal.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem('selectedCategory', this.selectedCategory());
    });
  }

  setSelectedCategory(category: string) {
    this.selectedCategorySignal.set(category);
  }
}
