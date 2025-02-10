import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root', // Это делает AuthService доступным для инъекции в любом месте приложения
})

export class AuthAdminService {
    private isAuthenticated: boolean;
    private adminId: string | null;

    constructor(private dataService: DataService) {
        // Проверяем, есть ли пользователь в localStorage
        this.isAuthenticated = localStorage.getItem('admin') !== null;
        this.adminId = localStorage.getItem('adminId');
    }

    loginadmin() {
        this.isAuthenticated = true;
        localStorage.setItem('admin', 'true'); // Сохраняем состояние аутентификации
    }

    logoutadmin() {
        this.isAuthenticated = false;
        localStorage.removeItem('admin'); // Удаляем состояние аутентификации
        localStorage.removeItem('adminId');
        this.adminId = null;
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated; // Возвращаем состояние аутентификации
    }
}