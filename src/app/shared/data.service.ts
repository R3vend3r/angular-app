import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Note, UserData, User } from '../models/note.model'; // Убедитесь, что путь правильный

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // Укажите правильный URL вашего API

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      catchError(error => {
        // Выводим сообщение об ошибке
        let errorMessage = 'Неизвестная ошибка';
        if (error.status === 401) {
          errorMessage = 'Неверный логин или пароль'; // Пример для статуса 401
        } else if (error.status === 404) {
          errorMessage = 'Пользователь не найден'; // Пример для статуса 404
        }
  
        console.error('Ошибка при входе:', errorMessage);
        return throwError(errorMessage); // Возвращаем сообщение об ошибке
      })
    );
  }

getUserData(): Observable<any> {
    return this.http.get('/projects.json');
  }

  // Получить все заметки
  getNotesByUserId(userId: number): Observable<{ notes: Note[] }> {
    return this.http.get<{ notes: Note[] }>(`${this.apiUrl}/notes/${userId}`).pipe(
        catchError(error => {
            console.error('Ошибка при получении заметок:', error);
            return throwError(error);
        })
    );
}

  // Добавить новую заметку
  addNote(userId: number, note: Omit<Note, 'id'>): Observable<Note> {
    const noteWithUserId = { userId, ...note }; // Объединяем userId с заметкой
    return this.http.post<Note>(`${this.apiUrl}/addNote`, noteWithUserId).pipe(
        catchError(error => {
            console.error('Ошибка при добавлении заметки:', error);
            return throwError(error);
        })
    );
}


  getUserByEmail(email: string): Observable<User | undefined> {
    return this.http.get<User[]>(`http://localhost:3000/users?email=${email}`).pipe(
        map((users: User[]) => users[0] ? users[0] : undefined) // Исправлено: добавлены скобки для параметра
    );
}
  getUserProfile(userId: number): Observable<UserData> {
    return this.http.get<UserData>(`/api/users/${userId}/profile`);
  }
  
//   updateEmail(email: string, userId: number): Observable<any> {
//     return this.http.post(`${this.apiUrl}/updateEmail`, { email, userId }).pipe(
      
//         catchError(error => {
//             console.error('Ошибка при обновлении email:', error);
//             return throwError(error);
//         })
//     );
// }

  // Обновить заметку
  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/updateNote/${note.id}`, note).pipe(
       catchError(error => {
           console.error('Ошибка при обновлении заметки:', error);
           return throwError(error);
       })
    );
 }

  // Регистрация нового пользователя
register(username: string, email: string, password: string, name: string= '', surname: string = '', phone: string = '',  profileImage: string = ''): Observable<any> {
  const userData = { login: username, email, password,name, surname, phone, profileImage }; // Измените здесь
  return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
          console.error('Ошибка при регистрации:', error);
          return throwError(error);
      })
  );
}

  // Вход пользователя

  loginadmin(adminname: string, password: string): Observable<any> {
    const loginData = { adminname, password };
    return this.http.post(`${this.apiUrl}/loginadmin`, loginData).pipe(
      catchError(error => {
        // Выводим сообщение об ошибке
        let errorMessage = 'Неизвестная ошибка';
        if (error.status === 401) {
          errorMessage = 'Неверный логин или пароль'; // Пример для статуса 401
        } else if (error.status === 404) {
          errorMessage = 'Пользователь не найден'; // Пример для статуса 404
        }
  
        console.error('Ошибка при входе:', errorMessage);
        return throwError(errorMessage); // Возвращаем сообщение об ошибке
      })
    );
  }
  

  updateSurname(surname: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateSurname`, { surname });
  }

  updatePhone(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/updatePhone`, { phone });
  }

  // Обновить имя пользователя
  updateUserName(userId: number, name: string): Observable<any> {
    const payload = { name };
    return this.http.put(`${this.apiUrl}/updateName/${userId}`, payload).pipe(
      catchError(error => {
        console.error('Ошибка при обновлении имени пользователя:', error);
        return throwError(error);
      })
    );
  }

  updateBirthDate(userId: number, birthDate: string): Observable<any> {
    const payload = { birthDate, userId };
    return this.http.post(`${this.apiUrl}/updateBirthDate`, payload).pipe(
        catchError(error => {
            console.error('Ошибка при обновлении даты рождения пользователя:', error);
            return throwError(error);
        })
    );
}

submitReview(name: string, email: string, message: string, isPublished = false): Observable<any> {
  const reviewData = { name, email, message, isPublished  };
  return this.http.post(`${this.apiUrl}/submit-review`, reviewData);
}

getReviews(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/reviews`);
}

getPublishedReviews(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/published-reviews`);
}

publishReview(reviewId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/reviews/${reviewId}/publish`, {});
}

// Отмена публикации отзыва
unpublishReview(reviewId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/reviews/${reviewId}/unpublish`, {});
}

// Удаление отзыва
deleteReview(reviewId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/reviews/${reviewId}`);
}

// uploadProfileImage(userId: number, file: File): Observable<any> {
//   const formData = new FormData();

//   formData.append('image', file); // Добавляем файл
//   formData.append('userId', userId.toString()); // Добавляем ID пользователя

//   return this.http.post(`${this.apiUrl}/updateProfileImage`, formData).pipe(
//       catchError(error => {
//           console.error('Ошибка при загрузке изображения профиля:', error);
//           return throwError(error);
//       })
//   );
// }

deleteNote(noteId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deleteNote/${noteId}`).pipe(
      catchError(error => {
          console.error('Ошибка при запросе на удаление заметки:', error);
          return throwError(error);
      })
  );
}


// getUserProfileImage(userId: number): Observable<any> {
//   return this.http.get(`${this.apiUrl}/user/${userId}/profileImage`).pipe(
//       catchError(error => {
//         console.error('Ошибка при получении изображения профиля:', error);
//         return throwError(error);
//     })
//   );
// }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`); // Измените на ваш конечный путь
  }
}