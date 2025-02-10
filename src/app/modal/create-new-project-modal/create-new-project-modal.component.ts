import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model'; // Импортируйте интерфейс Note

@Component({
  selector: 'app-create-new-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-project-modal.component.html',
  styleUrls: ['./create-new-project-modal.component.scss']
})
export class CreateNewProjectModalComponent {
  @Input() project: Note | null = null; 
  @Output() projectCreated = new EventEmitter<Omit<Note, 'id'>>(); // Изменен тип события
  @Output() closeModal = new EventEmitter<void>();

  projectName: string = ''; 
  projectDescription: string = ''; 
  projectDifficulty: string = '';
  projectNameInvalid: boolean = false;

  addProject() {
    this.projectNameInvalid = !this.projectName;

    if (this.projectNameInvalid) {
        return; // Если имя проекта отсутствует, выходим из функции
    }
    const userIdString = localStorage.getItem('userId'); // Получаем userId как строку
 // Преобразуем в number
    console.log(userIdString);
    // Если имя проекта присутствует, создаем проект
    this.projectCreated.emit({ 
        userIdString, // Укажите значение по умолчанию или генерируйте его, если это необходимо
        name: this.projectName, 
        description: this.projectDescription, 
        difficulty: this.projectDifficulty 
    } as Omit<Note, "id">); // Приведение типа
    this.close(); // Закрываем модальное окно после добавления проекта
}
  onProjectNameChange() {
    this.projectNameInvalid = !this.projectName; // Проверяем валидность имени проекта
  }

  close() {
    this.closeModal.emit(); // Вызываем событие закрытия
    this.resetForm(); // Сбрасываем форму после закрытия
  }

  resetForm() {
    this.projectName = '';
    this.projectDescription = '';
    this.projectDifficulty = '';
    this.projectNameInvalid = false;
  }
}