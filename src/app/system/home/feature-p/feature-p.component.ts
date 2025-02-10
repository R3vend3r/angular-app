import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-feature-p',
  standalone: true,
  templateUrl: './feature-p.component.html',
  styleUrl: './feature-p.component.scss',
  
})

export class FeaturePComponent {
  constructor(private router: Router) {}

  navigateToProject() {
    this.router.navigate(['/page-project']);
  }
}
