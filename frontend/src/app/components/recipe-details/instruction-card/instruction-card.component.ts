import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-card',
  imports: [],
  templateUrl: './instruction-card.component.html',
  styleUrl: './instruction-card.component.css'
})
export class InstructionCardComponent {
  @Input() instruction: string[] | undefined = [];
}
