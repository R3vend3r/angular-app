import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root', // Это делает AuthService доступным для инъекции в любом месте приложения
})
export class AuthService {
  private isAuthenticated: boolean;
  private userId: string | null;

  constructor(private dataService: DataService) {
    // Проверяем, есть ли пользователь в localStorage
    this.isAuthenticated = localStorage.getItem('user') !== null;
    this.userId = localStorage.getItem('userId');
  }
  login() {
    this.isAuthenticated = true;
    localStorage.setItem('user', 'true'); // Сохраняем состояние аутентификации
  }
  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('user'); // Удаляем состояние аутентификации
    localStorage.removeItem('userId');
    this.userId = null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated; // Возвращаем состояние аутентификации
  }
  deleteUser() {
    if (this.userId) {
      console.log(this.userId);
      return this.dataService.deleteUser(this.userId).subscribe({
        next: (response) => {
          console.log('Пользователь успешно удален:', response);
          this.logout(); // Логируем пользователя после удаления
        },
        error: (error) => {
          console.error('Ошибка при удалении пользователя:', error);
        }
      });
    } else {
      console.error('User ID не найден. Удаление невозможно.');
      return null; 
    }
  }
}