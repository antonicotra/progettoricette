import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-categorybutton',
  imports: [],
  templateUrl: './categorybutton.component.html',
  styleUrl: './categorybutton.component.css'
})
export class CategorybuttonComponent {
  @Input() category: any;
}
