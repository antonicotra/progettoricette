import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RecipeService } from '../../../services/recipe.service';
import { CategorySelectedService } from '../../../services/categoryselected.service';

@Component({
  selector: 'app-searchbar',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  recipeForm: FormGroup;
  private readonly recipesService = inject(RecipeService);
  private readonly categoryselectedService = inject(CategorySelectedService);

  constructor(private fb: FormBuilder) {
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required]]
    })
  }

  onSubmit(): void {
    if(this.recipeForm.valid) {
      this.recipesService.setNameMeal(this.recipeForm.value.name)
    } else {
      console.log('Form is invalid')
    }
  }
}
