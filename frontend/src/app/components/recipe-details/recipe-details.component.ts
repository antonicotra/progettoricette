import { Component, inject } from '@angular/core';
import {Router,RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { Location } from '@angular/common';
import { InstructionCardComponent } from './instruction-card/instruction-card.component';

@Component({
  selector: 'app-recipe-details',
  imports: [InstructionCardComponent, RouterLink],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})

export class RecipeDetailsComponent {

  recipe?: Recipe;
  private location = inject(Location);
  
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.recipe = navigation.extras.state['recipe'];
    }
  }

  goBack(): void {
    this.location.back();
  }

} 
