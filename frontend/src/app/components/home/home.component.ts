import { Component } from '@angular/core';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { CategoriesboxComponent } from './categoriesbox/categoriesbox.component';
import { RecipesectionComponent } from './recipesection/recipesection.component';

@Component({
  selector: 'home-main',
  imports: [SearchbarComponent, CategoriesboxComponent, RecipesectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
