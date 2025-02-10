import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model'; // Импортируйте интерфейс Note

@Component({
    selector: 'app-redact-note',
    templateUrl: './redact-note.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styleUrls: ['./redact-note.component.scss']
})
export class RedactNoteComponent implements OnInit {
    @Input() note: Note | null = null; 
    @Output() noteEdit = new EventEmitter<Note>();
    @Output() closeModal = new EventEmitter<void>();

    isEditModalOpen: boolean = false;
    projectName: string = ''; 
    projectDescription: string = ''; 
    projectNameInvalid: boolean = false;

    ngOnInit() {
        if (this.note) {
            this.projectName = this.note.name;
            this.projectDescription = this.note.description;
            // difficulty не нужно инициализировать, так как мы его не будем редактировать
        }
    }

    redactNote() {
        this.projectNameInvalid = !this.projectName;

        if (this.projectNameInvalid) {
            return; // Если имя заметки отсутствует, выходим из функции
        }

        // Создаем объект обновленной заметки
        const updatedNote: Note = {
            id: this.note!.id,
            name: this.projectName,
            description: this.projectDescription,
            difficulty: this.note!.difficulty // Используем текущее значение difficulty
        };

        this.noteEdit.emit(updatedNote); // Эмитируем событие с обновленной заметкой
        this.close(); // Закрываем модальное окно
    }

    close() {
        this.closeModal.emit(); // Запускаем событие закрытия
        this.resetForm(); // Сбрасываем форму после закрытия
    }

    resetForm() {
        this.projectName = '';
        this.projectDescription = '';
        this.projectNameInvalid = false;
    }
}