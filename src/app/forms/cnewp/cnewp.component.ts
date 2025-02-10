import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Note, UserData } from '../../models/note.model'; // Импортируем класс Note
import { CreateNewProjectModalComponent } from '../create-new-project-modal/create-new-project-modal.component';
import { DataService } from '../../shared/data.service';
import { Router } from '@angular/router';
import { RedactNoteComponent } from '../redact-note/redact-note.component';

@Component({
  selector: 'app-cnewp',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateNewProjectModalComponent, RedactNoteComponent],
  templateUrl: './cnewp.component.html',
  styleUrls: ['./cnewp.component.scss']
})



export class CnewpComponent implements OnInit {
  @Input() openProjectsCount: number = 0;
  @Input() closedProjectsCount: number = 0;
  @Input() isOpen: boolean = true;

  notes: Note[] = []; // Изменяем имя переменной на notes
  isModalOpen: boolean = false;
  selectedDifficulty: string = '';
  selectPriority: string= '';
  selectedNote: Note | null = null;
  isEditModalOpen: boolean = false; // Переменная для отслеживания состояния модального окна редактирования
  message: string = '';
  

  constructor(private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        this.dataService.getUserByEmail(userEmail).subscribe(userData => {
            console.log('Полученные данные пользователя:', userData);
            if (userData) {
                const userIdString = localStorage.getItem('userId'); // Получаем userId как строку
                const userId = userIdString ? parseInt(userIdString, 10) : null; // Преобразуем в number

                if (userId !== null) {
                    this.loadNotes(userId); // Вызываем метод с userId
                } else {
                    console.error('userId не является допустимым числом');
                }
            } else {
                console.error('Пользователь с данным email не найден:', userEmail);
            }
        }, error => {
            console.error('Ошибка при загрузке пользователя:', error);
        });
    }    
}

loadNotes(userId: number) {
    this.dataService.getNotesByUserId(userId).subscribe({
        next: (response) => {
            // Проверка на наличие данных заметок
            if (response && response.notes && response.notes.length > 0) {
                // Извлекаем заметки
                this.notes = response.notes.map(note => ({
                    id: note.id,
                    name: note.name,
                    description: note.description,
                    priority: note.priority,
                    difficulty: note.difficulty,
                    
                })) as Note[];

                this.updateProjectCounts();
            } else {
                console.error('Не найдены заметки в ответе');
                this.message = 'Вы указали неправильный пароль';
            }
        },
        error: (error) => {
            console.error('Ошибка при загрузке заметок:', error);
        }
    });
}

async addProject(note: Omit<Note, "id">) { // Используем Omit для _id
  const newNote: Omit<Note, "id"> = { 
      ...note 
  };
  const userIdString = localStorage.getItem('userId');
  const userId = Number(userIdString); // Преобразуем в number

  if (this.selectedDifficulty || this.selectPriority) {
      newNote.difficulty = this.selectedDifficulty; // Добавляем поле сложности, если оно выбрано
      newNote.priority = this.selectPriority;
  }
  this.dataService.addNote(userId,newNote).subscribe({
      next: (response: Note) => {
          this.notes.push(response); // Добавляем новую заметку в массив
          this.openProjectsCount++; 
          this.closeModal(); 
          this.updateProjectCounts(); 
          this.loadNotes(userId);
      },
      error: (error) => {
          console.error('Error adding note:', error);
      }
  });
}

openEditNoteModal(note: Note) {
    this.selectedNote = note; // Сохраняем выбранную заметку
    this.isEditModalOpen = true; // Открываем модальное окно редактирования
}

closeEditModal() {
    this.isEditModalOpen = false; // Закрываем модальное окно редактирования
    this.selectedNote = null; // Сбрасываем выбранную заметку
}

redactNote(updatedNote: Note) {
    // Логика для обновления заметки
    this.dataService.updateNote(updatedNote).subscribe({
        next: (response) => {
            console.log('Note updated:', response);
            this.loadNotes(Number(localStorage.getItem('userId'))); // Перезагружаем заметки
            this.closeEditModal(); // Закрываем модальное окно
        },
        error: (error) => {
            console.error('Error updating note:', error);
        }
    });
}

deleteNote(noteId: number) {
    this.dataService.deleteNote(noteId).subscribe({
        next: response => {
            console.log('Заметка удалена', response);
            // Удаляем заметку из массива
            this.notes = this.notes.filter(note => note.id !== noteId);
        },
        error: error => {
            console.error('Ошибка при удалении заметки', error);
        }
    });
}

updateNote(note: Note) {
  this.dataService.updateNote(note).subscribe({
      next: (response) => {
          console.log('Note updated:', response);

      },
      error: (error) => {
          console.error('Error updating note:', error);
          this.notes = this.notes.map(n => n.id === note.id ? { ...n, ...note } : n);
      }
  });
}

onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'priority') {
        this.sortByPriority();
    } else if (value === 'difficulty') {
        this.sortByDifficulty();
    }
}

sortByPriority() {
    const priorityOrder: Record<string, number> = {
        'unimportant': 4,
        'secondary': 3,
        'important': 2,
        'critical': 1
    };
    this.notes.sort((a, b) => (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0));
}

sortByDifficulty() {
    const difficultyOrder: Record<string, number> = {
        'easy': 1,
        'medium': 2,
        'hard': 3,
        'very-hard': 4
    };
    this.notes.sort((a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0));
}

  toggleForm(action: string) {
    this.isOpen = action === 'open';
}

openCreateProjectModal() {
    this.isModalOpen = true; // Открываем модальное окно
}

closeModal() {
    this.isModalOpen = false; // Закрываем модальное окно
}

updateProjectCounts() {
    this.openProjectsCount = this.notes.length; // Обновляем количество заметок
    this.closedProjectsCount = 0; // Если у вас нет закрытых заметок, можно оставить 0

}

// Геттеры для фильтрации заметок
get openProjects() {
    return this.notes; // Возвращаем все заметки
}

get closedProjects() {
    return []; // Если у вас нет закрытых заметок, возвращаем пустой массив
}
}