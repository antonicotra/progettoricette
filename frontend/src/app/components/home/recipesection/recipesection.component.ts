import { Component } from '@angular/core';
import { HeadersectionComponent } from './headersection/headersection.component';
import { RecipesboxComponent } from './recipesbox/recipesbox.component';

@Component({
  selector: 'app-recipesection',
  imports: [HeadersectionComponent, RecipesboxComponent],
  templateUrl: './recipesection.component.html',
  styleUrl: './recipesection.component.css'
})
export class RecipesectionComponent {

}
