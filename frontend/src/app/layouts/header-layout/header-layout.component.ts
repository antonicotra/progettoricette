import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/shared/header/header.component';

@Component({
  selector: 'app-header-layout',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './header-layout.component.html',
  styleUrl: './header-layout.component.css'
})
export class HeaderLayoutComponent {

}
