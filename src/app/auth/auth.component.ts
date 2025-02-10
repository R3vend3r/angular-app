import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule, AsyncValidatorFn,AbstractControl, ValidationErrors  } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { User } from '../models/note.model';
import { Observable, of, catchError, map } from 'rxjs';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit, OnInit {
  @ViewChild('container') container!: ElementRef; 
  form1!: FormGroup;
  form2!: FormGroup;
  isRegistering: boolean = false;
  email: string = '';
  password: string = '';
  username: string = '';
  emailError: string = '';
  passwordError: string = '';
  usernameError: string = '';
  errorMessage: string = '';
  
  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
  
  this.form1 = new FormGroup({
    'email1': new FormControl(null, [Validators.required, Validators.email], ),
    'password1': new FormControl(null, [Validators.required, Validators.minLength(8)])
  });
  
  this.form2 = new FormGroup({
    'username': new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'password': new FormControl(null, [Validators.required, Validators.minLength(8)])
  });
  }

  ngAfterViewInit() {
    const registerButton = document.getElementById("register");
    const loginButton = document.getElementById("login");

    registerButton?.addEventListener("click", () => {
      this.switchToRegister();
    });

    loginButton?.addEventListener("click", () => {
      this.switchToLogin();
    });
  }

  switchToRegister() {
    this.email = '';
    this.password = '';
    this.username = '';
    this.container.nativeElement.classList.add("right-panel-active");
    this.isRegistering = true;
    this.clearErrors();
  }

  switchToLogin() {
    this.email = '';
    this.password = '';
    this.username = '';
    this.container.nativeElement.classList.remove("right-panel-active");
    this.isRegistering = false;
    this.clearErrors();
  }

  clearErrors() {
    this.emailError = '';
    this.passwordError = '';
    this.usernameError = '';
  }

  validateUsername() {
    if (this.username.length < 4) {
      this.usernameError = "*Username must be at least 4 characters.";
    } else if (this.username.length > 20) {
      this.usernameError = "*Username must be less than 20 characters.";
    } else {
      this.usernameError = '';
    }
  }

  validateEmail() {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const em = this.form1.value;
    if (!emailRegex.test(em.email1)) {
      this.emailError = "*Email is not valid";
    } else {
      this.emailError = '';
    }
  }

  validatePassword() {
    const passwordControl = this.form1.get('password1');
    if (passwordControl) {
      const passwordValue = passwordControl.value;
  
      if (passwordValue.length < 8) {
        this.passwordError = "*Пароль должен содержать минимум 8 символов.";
      } else if (passwordValue.length > 20) {
        this.passwordError = "*Пароль должен содержать менее 20 символов.";
      } else {
        this.passwordError = '';
      }
    }
  }

  onLoginSubmit() {
    if (this.form1.valid) {
        const fData = this.form1.value; 
        this.dataService.login(fData.email1, fData.password1).subscribe({
            next: (response) => {
                window.localStorage.clear();
                console.log('Успешный вход:', response);
                // Сохраните информацию о пользователе в localStorage или выполните другие действия
                window.localStorage.setItem('user', JSON.stringify(response.user)); // Предполагается, что сервер возвращает объект пользователя
                this.authService.login(); // Ваша логика входа
                localStorage.setItem('userEmail', fData.email1);
                
                this.router.navigate(['/home']);
            },
            error: (error) => {
                console.error('Неверный email или пароль', error);
                this.errorMessage = error;
            }
        });
    } else {
        console.error('Форма недействительна');
        this.validateEmail(); // Валидация email
        this.validatePassword(); // Валидация пароля
    }
}

validateEmailr() {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(this.email)) {
    this.emailError = "*Email is not valid";
    return false; // Возвращаем false, если валидация не удалась
  } else {
    this.emailError = '';
    return true; // Возвращаем true, если валидация прошла успешно
  }
}

validatePasswordr() {
  if (this.password.length < 8) {
    this.passwordError = "*The password must contain at least 8 characters.";
    return false; // Возвращаем false при ошибках валидации
  } else if (this.password.length > 20) {
    this.passwordError = "*The password must contain less than 20 characters.";
    return false;
  } else {
    this.passwordError = '';
    return true;
  }
}

  onRegisterSubmit() {
    this.validateUsername();
    this.validateEmailr();
    this.validatePasswordr();
    const surname = ''; 
    const phone = '';
    const name = '';
    const profileImage = '';
    if (this.form2.valid) {
      const { username, email, password } = this.form2.value;
      this.dataService.register(username, email, password, name, surname, phone, profileImage).subscribe({
        next: (response) => {
          window.localStorage.clear();
          console.log('Регистрация успешна:', response);
          const userDetails = response.user;
          window.localStorage.setItem('user', JSON.stringify(userDetails));

          this.authService.login(); 
          localStorage.setItem('userEmail',email); 
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Ошибка регистрации:', error);
        }
      });
    } else {
      console.error('Форма регистрации недействительна');
    }
  }

  toggleAuth1() {
    this.switchToRegister();
  }

  toggleAuth2() {
    this.switchToLogin();
  }

  loadUserProfile(userId: number) {
    this.dataService.getUserProfile(userId).subscribe({
      next: (profileData) => {
        console.log('Загруженные данные профиля:', profileData);
        // Обновите состояние компонента с загруженными данными профиля
      },
      error: (error) => {
        console.error('Ошибка загрузки профиля:', error);
      }
    });
  }

  forbiddenEmails(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);                                                                  // Если значение пустое, возвращаем null
      }
  
      return this.dataService.getUserByEmail(control.value).pipe(
        map((user: User | undefined) => {
          return user ? { forbiddenEmail: true } : null;                                  // Если пользователь найден, возвращаем ошибку
        }),
        catchError(() => of(null))                                                        // В случае ошибки возвращаем null
      );
    };
  }

  ngOnDestroy() {
    const registerButton = document.getElementById("register");
    const loginButton = document.getElementById("login");
  
    registerButton?.removeEventListener("click", this.switchToRegister.bind(this));
    loginButton?.removeEventListener("click", this.switchToLogin.bind(this));
  }
}