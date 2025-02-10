import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-back-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './back-info.component.html',
  styleUrl: './back-info.component.scss'
})
export class BackInfoComponent {
  submitted = false;

  constructor(private dataService: DataService) {}

  onSubmit(form: NgForm) {
      if (form.invalid) {
          return;
      }

      const { name, email, message } = form.value; // Получаем данные из формы

      // Отправляем данные на сервер
      this.dataService.submitReview(name, email, message, false).subscribe({
          next: (response) => {
              console.log('Отзыв успешно отправлен:', response);
              this.submitted = true;
              form.reset();
              // Скрыть уведомление через 3 секунды
              setTimeout(() => {
                  this.submitted = false;
              }, 3000);
          },
          error: (error) => {
              console.error('Ошибка при отправке отзыва:', error);
          }
      });
  }
}
