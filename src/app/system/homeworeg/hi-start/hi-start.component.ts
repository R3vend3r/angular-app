import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthComponent } from '../../../auth/auth.component';

@Component({
  selector: 'app-hi-start',
  standalone: true,
  imports: [AuthComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './hi-start.component.html',
  styleUrl: './hi-start.component.scss'
})
export class HiStartComponent {
  constructor(private router: Router) {}

  toggleAuth() {
    this.router.navigate(['/auth']);
  }
}
