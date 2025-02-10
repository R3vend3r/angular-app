import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service'; // Импортируйте ваш DataService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthAdminService } from '../../shared/authadmin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  reviews: any[] = []; // Массив для хранения отзывов
  loading: boolean = true; // Флаг загрузки

  constructor(private dataService: DataService,
              private authService: AuthAdminService,
              private router: Router,
  ) {}

  ngOnInit() {
    this.loadReviews(); // Загружаем отзывы при инициализации компонента
  }

  loadReviews() {
    // Здесь вы можете использовать метод из DataService для получения отзывов
    this.dataService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data.map(review => ({ ...review, isPublished: review.isPublished === true }));
        this.loading = false; // Устанавливаем флаг загрузки в false
      },
      error: (error) => {
        console.error('Ошибка при загрузке отзывов:', error);
        this.loading = false; // Устанавливаем флаг загрузки в false
      }
    });
  }


  publishReview(reviewId: number) {
    // Метод для публикации отзыва
    this.dataService.publishReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.map(review => review.id === reviewId ? { ...review, isPublished: true } : review); // Обновляем состояние публикации отзыва
      },
      error: (error) => {
        console.error('Ошибка при публикации отзыва:', error);
      }
    });
  }

  unpublishReview(reviewId: number) {
    // Метод для отмены публикации отзыва
    this.dataService.unpublishReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.map(review => review.id === reviewId ? { ...review, isPublished: false } : review); // Обновляем состояние публикации отзыва
      },
      error: (error) => {
        console.error('Ошибка при отмене публикации отзыва:', error);
      }
    });
  }

  deleteReview(reviewId: number) {
    // Метод для удаления отзыва
    this.dataService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(review => review.id !== reviewId); // Удаляем отзыв из массива
      },
      error: (error) => {
        console.error('Ошибка при удалении отзыва:', error);
      }
    });
  }


  logout() {
    this.authService.logoutadmin(); // Вызываем метод выхода
    this.router.navigate(['/homeworeg']);
  }

}