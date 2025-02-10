// note.model.ts

export interface Note {
    id: number; // Или string, в зависимости от вашего API
    _id?: any; // Добавляем _id как необязательное поле
    name: string;
    description: string;
    priority: string;
    difficulty: string;
}

export interface UserData {
    id: number; // Добавляем id
    name?: string;
    surname?: string;
    phone?: string;
    login: string; // Добавляем поле login
    email: string;
    password: string; // Храните хэшированный пароль
    profileImage?: string; // Профильное изображение (необязательное поле)
    birthDate?: string;
    notes: Note[];
}

export class User {
    id: number; // Добавляем id
    name: string;
    surname: string;
    phone: string;
    login: string; // Добавляем поле login
    email: string;
    password: string; // Храните хэшированный пароль
    profileImage?: string; // Профильное изображение (необязательное поле)
    birthDate?: string;
    notes: Note[];

    constructor(id: number, name: string, surname: string, phone: string, login: string, email: string, password: string, birthDate?: string, profileImage?: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.login = login;
        this.email = email;
        this.password = password; // Храните хэшированный пароль
        this.profileImage = profileImage || ''; // Профильное изображение
        this.birthDate = birthDate;
        this.notes = [];
    }

    addNote(note: Note) {
        this.notes.push(note);
    }

    updateProfile(name: string, surname: string, phone: string, birthDate?: string, profileImage?: string) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        if (birthDate) {
            this.birthDate = birthDate;
        }
        if (profileImage) {
            this.profileImage = profileImage;
        }
    }
}