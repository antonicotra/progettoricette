import { Component } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import {Router, ActivatedRoute } from '@angular/router';
import { InstructionCardComponent } from './instruction-card/instruction-card.component';

@Component({
  selector: 'app-recipe-details',
  imports: [InstructionCardComponent],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})

export class RecipeDetailsComponent {

  recipe?: Recipe;
  
  constructor(private router: Router, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.recipe = navigation.extras.state['recipe'];
    }
  }

} 
