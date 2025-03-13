import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipecard',
  imports: [RouterLink],
  templateUrl: './recipecard.component.html',
  styleUrl: './recipecard.component.css'
})
export class RecipecardComponent {
  @Input() recipe: any;

}
