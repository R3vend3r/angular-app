import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from "../../common-ui/header/header.component";
import { FooterComponent } from "../../common-ui/footer/footer.component";
import { EmailComponent } from "../../forms/email/email.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserData, User } from '../../models/note.model'; 
import { DataService } from '../../shared/data.service';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-page-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, EmailComponent, CommonModule, FormsModule],
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.scss']
})
export class PageProfileComponent implements OnInit {
  imageSrc = 'img/person.png'; // Путь к изображению по умолчанию
  name: string = '';
  surname: string = '';
  phone: string = '';
  userData!: UserData;
  submitted = false;
  // Переменные для смены пароля
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  isChangingPassword: boolean = false;
  isPasswordChangeVisible: boolean = true;  // Новый флаг для видимости кнопки изменения пароля
  notificationMessage: string = '';

  constructor(private http: HttpClient,
              private router: Router,
              private dataService: DataService,
              private authService: AuthService) {
    this.userData = this.initializeUserData();
  }

  initializeUserData(): UserData {
    return {
      id: 0,
      name: '',
      surname: '',
      phone: '',
      login: '',
      email: '',
      password: '', // Храните хэшированный пароль
      notes: []
    };
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    
    if (userData) {
        const user = JSON.parse(userData);
        console.log('Извлеченные данные пользователя:', user); // Логируем извлеченные данные
        this.loadUserData(user);
    } else {
        console.warn('Пользователь не найден в localStorage');
    }
}

loadUserData(user: User): void {
  const em = localStorage.getItem('userEmail');
  // Проверяем, что em не null
  if (em) {
    this.dataService.getUserByEmail(em).subscribe(data => {
      console.log('Запрос данных для email из dataService:', em);
      console.log('Полученные данные:', data);
      if (data) {
        this.userData = data;
        console.log('Загруженные данные пользователя:', this.userData);
      } else {
        console.warn('Пользователь не найден или данные пустые');
      }
    }, error => {
      console.error('Ошибка при загрузке данных пользователя:', error);
    });
  } else {
    console.warn('Email пользователя не найден в localStorage');
  }
}
// loadImage(event: Event): void {
//   const input = event.target as HTMLInputElement;  
//   if (input.files && input.files[0]) {             
//       const file = input.files[0];

//       // Проверка размера файла (например, 5MB)
//       const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
//       if (file.size > maxSizeInBytes) {
//           alert('Размер файла превышает 5MB. Пожалуйста, выберите другой файл.');
//           return;
//       }

//       // Загрузка изображения через сервис
//       this.dataService.uploadProfileImage(this.userData.id, file).subscribe(
//           response => {
//               console.log('Изображение профиля обновлено:', response);
              
//               // После успешного обновления, можно установить новое изображение
//               this.imageSrc = URL.createObjectURL(file); // Превращает файл в изображение для отображения
//           },
//           error => {
//               console.error('Ошибка при обновлении изображения профиля:', error);
//           }
//       );
//   } else {
//       console.error('Файл не выбран или не доступен.');
//   }
// }


  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Имитация клика по скрытому input
    }
  }

  // Метод для изменения пароля
  changePassword() {
    if (this.newPassword === this.confirmNewPassword) {
        const payload = {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
            userId: this.userData.id // Используем актуальный ID пользователя
        };

        this.http.post('http://localhost:3000/changePassword', payload).subscribe(
            response => {
              console.log('Пароль успешно изменен', response);
                this.handlePasswordChangeSuccess();
            },
            error => {
                this.handlePasswordChangeError(error);
            }
        );
    } else {
        this.handlePasswordMismatch();
    }
}

handlePasswordChangeSuccess() {
  this.notificationMessage = 'Пароль успешно изменен'; // Успешное сообщение
  this.submitted = true; // Устанавливаем флаг для отображения уведомления

  // Очистка полей после изменения
  this.clearPasswordFields();
  
  // Скрыть уведомление через 5 секунд (5000 миллисекунд)
  setTimeout(() => {
      this.submitted = false;
      this.notificationMessage = ''; // Очищаем сообщение

  }, 5000);
}

handlePasswordChangeError(error: any) {
  console.error('Ошибка при изменении пароля:', error);
  this.notificationMessage = 'Вы указали неправильный пароль'; // Сообщение об ошибке
  this.submitted = true; // Устанавливаем флаг для отображения уведомления

  // Очистка полей после попытки изменения
  this.clearPasswordFields();

  // Скрыть уведомление через 5 секунд (5000 миллисекунд)
  setTimeout(() => {
      this.submitted = false;
      this.notificationMessage = ''; // Очищаем сообщение

  }, 5000);
}

handlePasswordMismatch() {
  console.error('Пароли не совпадают!');
  this.notificationMessage = 'Пароли не совпадают!'; // Сообщение о несовпадении паролей
  this.submitted = true; // Устанавливаем флаг для отображения уведомления

  // Очистка полей после попытки изменения
  this.clearPasswordFields();

  // Скрыть уведомление через 5 секунд (5000 миллисекунд)
  setTimeout(() => {
      this.submitted = false;
      this.notificationMessage = ''; // Очищаем сообщение

  }, 5000);
}

clearPasswordFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.isChangingPassword = false; // Скрываем форму
    this.isPasswordChangeVisible = true; // Показываем кнопку "Изменить пароль"
}
  // Метод для начала изменения пароля
  initiatePasswordChange() {
    this.isChangingPassword = true;
    this.isPasswordChangeVisible = false; // Скрыть кнопку "Изменить пароль"
  }

  Cancel(){
    this.isChangingPassword = false;
    this.isPasswordChangeVisible = true; 
  }

  saveName() {
    const trimmerName = (this.userData.name || '').trim();
    if (this.validateName(trimmerName)) {
      const payload = { name: trimmerName, userId: this.userData.id };
      this.http.post('http://localhost:3000/updateName', payload)
        .subscribe({
          next: response => {
            console.log('Имя обновлено:', response);
            this.userData.name = trimmerName; // Обновляем локальную переменную
          },
          error: error => {
            console.error('Ошибка при обновлении имени:', error);
          }
        });
    } else {
      console.error('Имя должно содержать только буквы.');
    }
  }
  saveSurname() {
    const trimmerSurname = (this.userData.surname || '').trim(); // Получаем фамилию из поля ввода
    if (this.validateSurname(trimmerSurname)) {
      const payload = { surname: trimmerSurname, userId: this.userData.id }; // Используем актуальный ID пользователя

      if (this.userData) {
          this.userData.surname = trimmerSurname;
      }
      this.http.post('http://localhost:3000/updateSurname', payload)
          .subscribe({
              next: response => {
                  console.log('Фамилия обновлена:', response);
              },
              error: error => {
                  console.error('Ошибка при обновлении фамилии:', error);
              }
          });
    } else {
        console.error('Фамилия должна содержать только буквы.');
    }
}

savePhone() {
  const trimmerPhone = (this.userData.phone || '').trim();
  if (this.validatePhone(trimmerPhone)) {
    const payload = { phone: trimmerPhone, userId: this.userData.id };
    this.http.post('http://localhost:3000/updatePhone', payload)
      .subscribe({
        next: response => {
          console.log('Телефон обновлен:', response);
          this.userData.phone = trimmerPhone; // Обновляем локальную переменную
        },
        error: error => {
          console.error('Ошибка при обновлении телефона:', error);
        }
      });
  } else {
    console.error('Телефон должен содержать только цифры.');
  }
}

saveBirthDate() {
  const trimmerBirthDate = (this.userData.birthDate || '').trim();
  
  // Проверка на корректность даты рождения
  if (this.validateBirthDate(trimmerBirthDate)) {
      const payload = { birthDate: trimmerBirthDate, userId: this.userData.id };

      this.http.post('http://localhost:3000/updateBirthDate', payload)
          .subscribe({
              next: response => {
                  console.log('Дата рождения обновлена:', response);
                  this.userData.birthDate = trimmerBirthDate; // Обновляем локальную переменную
              },
              error: error => {
                  console.error('Ошибка при обновлении даты рождения:', error);
              }
          });
  } else {
      console.error('Пользователь должен быть не младше 10 лет.');
  }
}

  // Метод для валидации имени
  validateName(name: string | null): boolean {
    return name ? /^[A-Za-zА-Яа-яЁё]+$/.test(name.trim()) : false;
  }

  // Метод для валидации фамилии
  validateSurname(surname: string | null): boolean {
    const surnamePattern = /^[A-Za-zА-Яа-яЁё]+$/; // Регулярное выражение для проверки только букв
    return surname ? surnamePattern.test(surname.trim()) : false;
  }

  // Метод для валидации телефона
  validatePhone(phone: string | null): boolean {
    return phone ? /^\+?[0-9\s-()]{7,15}$/.test(phone.trim()) : false;
 }

 validateBirthDate(birthDate: string): boolean {
  const date = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  // Проверяем, есть ли у пользователя 10 лет
  return age > 10 || (age === 10 && monthDiff >= 0);
}

 onSubmit(form: NgForm) {
     if (form.invalid) {
         return; // Если форма невалидна, выходим из метода
     }

     this.changePassword();

 }

 onLogout(){
  this.authService.logout();
  this.router.navigate(['/homeworeg']);
 }

 onDeleteUser() {
  this.authService.deleteUser();
  this.router.navigate(['/homeworeg']);
}

}