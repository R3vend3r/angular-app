import { Component, OnInit } from '@angular/core';
import { AuthAdminService } from '../../shared/authadmin.service';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule, AsyncValidatorFn,AbstractControl, ValidationErrors  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth-admin.component.html',
  styleUrl: './auth-admin.component.scss'
})
export class AuthAdminComponent implements OnInit {
  form1!: FormGroup;
  admin: string = '';
  password: string = '';
  passwordError: string = '';
  adminnameError: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private dataService: DataService,
    private authadminService: AuthAdminService
  ) {}

  ngOnInit() {
  
    this.form1 = new FormGroup({
      'admin1': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'password1': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }



  onLoginSubmit() {
    if (this.form1.valid) {
        const fData = this.form1.value; 
        this.dataService.loginadmin(fData.admin1, fData.password1).subscribe({
            next: (response) => {
                window.localStorage.clear();
                console.log('Успешный вход в аккаунт админа:', response);
                // Сохраните информацию о пользователе в localStorage или выполните другие действия
                window.localStorage.setItem('admin', JSON.stringify(response.admin)); // Предполагается, что сервер возвращает объект пользователя
                this.authadminService.loginadmin(); // Ваша логика входа
                localStorage.setItem('adminLogin', fData.admin1);
                
                this.router.navigate(['/admin-page']);
            },
            error: (error) => {
                console.error('Неверный логин или пароль', error);
                this.errorMessage = error;
            }
        });
    } else {
        console.error('Форма недействительна');
        this.validateAdminAccess(); // Валидация email
        this.validatePassword(); // Валидация пароля
    }
}


  // clearErrors() {
  //   this.passwordError = '';
  //   this.adminnameError = '';
  // }


  validateAdminAccess() {
    const AccessControl = this.form1.get('admin1');
    if (AccessControl) {
      const adminHello = AccessControl.value;

      if (adminHello.length < 8) {
        this.adminnameError = "*admin login must be at least 8 characters.";
      } else if (adminHello.length > 20) {
        this.adminnameError = "*admin login must be less than 20 characters.";
      } else {
        this.adminnameError = '';
      }
    }
  }

  validatePassword() {
    const passwordControl = this.form1.get('password1');
    if (passwordControl) {
      const passwordValue = passwordControl.value;
  
      if (passwordValue.length < 8) {
        this.passwordError = "*The password must contain at least 8 characters.";
      } else if (passwordValue.length > 20) {
        this.passwordError = "*The password must contain less than 20 characters.";
      } else {
        this.passwordError = '';
      }
    }
  }
}
