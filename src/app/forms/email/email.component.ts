import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-email',
  standalone: true,
  template: `
    <ng-container>
           <p>{{ email }}</p>
    </ng-container>
  `,
  styles: [`
  p{
    margin: 10px 0 10px 0;
    font-size:14px;
    color: #323442;
  }
  `],
  imports: [FormsModule, CommonModule]
})
export class EmailComponent implements OnInit {
  @Input() email: string = '';
  newEmail: string = '';

  constructor(private http: HttpClient,
    private userService: DataService
  ) {}

  ngOnInit(): void {
    this.loadEmail();
  }

  loadEmail(): void {
    const userProfile = localStorage.getItem('user'); // Получаем профиль пользователя
    const userEmail = localStorage.getItem('userEmail');
    const user = userProfile ? JSON.parse(userProfile) : null; // Парсим профиль пользователя
    console.log('Полученные данные пользователя:', user);
    if (user && userEmail) { // Проверяем, что пользователь существует и у него есть email
        this.userService.getUserByEmail(userEmail).subscribe(userData => {
            console.log('Полученные данные пользователя:', userData);
            if (userData) {
                this.email = userData.email; // Устанавливаем email пользователя
                this.newEmail = this.email; // Инициализируем новый e-mail
            } else {
                console.error('Пользователь с данным email не найден:', user.email);
            }
        }, error => {
            console.error('Ошибка при загрузке пользователя:', error);
        });
    } else {
        console.error('Профиль пользователя не найден или email не установлен.');
    }
 }
}
