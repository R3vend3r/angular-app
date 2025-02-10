import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-rewies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="review-card">
      <h3>{{ review.name }}</h3>
      <p><strong>Email:</strong> {{ this.transform(review.email) }}</p>
      <p>{{ review.message }}</p>
    </div>
  `,
  styles: [`
    .review-card {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      background-color: #f9f9f9;
      flex-grow: 1;
      flex-basis: 0;
      height: 230px;
      max-height: 300px;
}
    p{
      margin-top: 10px;
    }
  `]
})
export class RewiesComponent {
  @Input() review: any;

  transform(email: string): string {
    const parts = email.split('@');
    return parts[0].slice(0, 2) + '*****@' + parts[1];
  }
}
