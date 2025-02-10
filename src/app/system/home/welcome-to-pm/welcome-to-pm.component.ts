import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-welcome-to-pm',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,],
  templateUrl: './welcome-to-pm.component.html',
  styleUrl: './welcome-to-pm.component.scss'
})
export class WelcomeToPmComponent {
  constructor(private router: Router) {}

  navigateTo(page: string) {
    this.router.navigate([page]); // Параметр url будет передан
  }
}
