const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;
const jsonFilePath = path.join(__dirname, 'public/usersdata.json');
const jsonFileAdminPath = path.join(__dirname, 'public/projects.json');


const cors = require('cors');
app.use(cors());
// Для парсинга JSON-данных
app.use(bodyParser.json({ limit: '10mb' }));


function readFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
        throw error; // Можно выбросить ошибку, чтобы обработать ее выше
    }
}

// Функция для записи данных в файл
function saveToFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Ошибка записи в файл:', error);
        throw error; // Можно выбросить ошибку, чтобы обработать ее выше
    }
}

// Получить информацию о пользователе
app.get('/users', (req, res) => {
    const data = readFromFile(jsonFilePath);
    const email = req.query.email; // Получаем email из параметров запроса
    // console.log('Данные пользователей:', data); // Логируем данные пользователей

    // Фильтруем пользователей по email
    const filteredUsers = data.users.filter(user => user.email === email);
    res.json(filteredUsers); // Возвращаем отфильтрованный список пользователей
});

const bcrypt = require('bcrypt');

// Регистрация нового пользователя
app.post('/register', async (req, res) => {
    const { login,name='', surname = '', phone = '', profileImage='', birthDate='',  email, password} = req.body; // Устанавливаем значения по умолчанию для surname и phone
    const users = readFromFile(jsonFilePath).users;

    // Проверка на наличие обязательных полей
    if (!login || !email || !password) {
        return res.status(400).json({ message: 'Логин, email и пароль обязательны.' });
    }

    // Проверка на уникальность логина и email
    const existingUser = users.find(user => user.login === login || user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким логином или email уже существует.' });
    }

    const newId = users.length ? users[users.length - 1].id + 1 : 1;

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: newId,
        login,
        name,
        surname,
        phone, 
        profileImage,
        email,
        birthDate,
        password: hashedPassword,
        notes: [] // Инициализируем пустой массив заметок
    };

    users.push(newUser);
    saveToFile(jsonFilePath, { users });
    res.status(201).json({ message: 'Пользователь зарегистрирован', user: newUser });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = readFromFile(jsonFilePath).users;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Неверный пароль' });
    }

    res.status(200).json({ message: 'Успешный вход', user });
});


app.post('/loginadmin', async (req, res) => {
    const { adminname, password } = req.body; // Измените на adminname
    const admins = readFromFile(jsonFileAdminPath).admin; // Получаем массив администраторов

    const admin = admins.find(a => a.login === adminname); // Ищем администратора по логину
    if (!admin) {
        return res.status(404).json({ message: 'Администратор не найден' });
    }

    const isMatch = await bcrypt.compare(password, admin.password); // Сравниваем пароли
    if (!isMatch) {
        return res.status(401).json({ message: 'Неверный пароль' });
    }

    res.status(200).json({ message: 'Успешный вход', admin }); // Возвращаем администратора
});

app.get('/reviews', (req, res) => {
    const data = readFromFile(jsonFileAdminPath);
    const admin = data.admin[0]; // Предполагаем, что у нас только один администратор
    res.json(admin.reviews);
});

app.get('/published-reviews', (req, res) => {
    try {
        const adminData = readFromFile(jsonFileAdminPath); // Читаем данные
        const publishedReviews = adminData.admin[0].reviews.filter(review => review.isPublished); // Фильтруем по isPublished
        res.json(publishedReviews); // Возвращаем отфильтрованные отзывы
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});

// Удаление отзыва
app.delete('/reviews/:id', (req, res) => {
    const reviewId = parseInt(req.params.id, 10);
    const data = readFromFile(jsonFileAdminPath);
    const admin = data.admin[0]; // Предполагаем, что у нас только один администратор

    // Удаляем отзыв
    const initialLength = admin.reviews.length;
    admin.reviews = admin.reviews.filter(review => review.id !== reviewId);

    if (admin.reviews.length < initialLength) {
        saveToFile(jsonFileAdminPath, data); // Сохраняем изменения в файл
        return res.status(200).json({ message: 'Отзыв успешно удален' });
    } else {
        return res.status(404).json({ message: 'Отзыв не найден' });
    }
});

app.post('/submit-review', (req, res) => {
    console.log('Тело запроса:', req.body); 

    const { name, email, message, isPublished  } = req.body;
    const data = readFromFile(jsonFileAdminPath); // Читаем данные из файла
    const admins = data.admin; // Получаем массив администраторов

    // Предполагаем, что у нас только один администратор
    const admin = admins[0]; // Или используйте нужного администратора по id

    if (admin) {
        // Генерация нового ID для отзыва
        const newId = admin.reviews.length ? admin.reviews[admin.reviews.length - 1].id + 1 : 1; 
        const newReview = { id: newId, name, email, message, isPublished }; // Создание нового отзыва
        admin.reviews.push(newReview); // Добавляем отзыв в массив

        // Сохраняем изменения в файл
        saveToFile(jsonFileAdminPath, { admin: admins }); // Записываем обновленные данные в файл

        // Возвращаем успешный ответ
        return res.status(201).json({ message: 'Отзыв успешно отправлен', review: newReview });
    } else {
        return res.status(404).json({ message: 'Администратор не найден' });
    }
});
app.put('/reviews/:id/publish', (req, res) => {
    const reviewId = req.params.id;
    const data = readFromFile(jsonFileAdminPath); // Читаем данные из файла
    const reviews = data.admin[0].reviews; // Получаем массив отзывов
    const reviewIndex = reviews.findIndex(review => review.id === parseInt(reviewId)); // Находим индекс отзыва

    if (reviewIndex !== -1) {
        reviews[reviewIndex].isPublished = true; // Изменяем статус публикации

        // Сохраняем изменения в файл
        saveToFile(jsonFileAdminPath, data); // Записываем обновленные данные в файл

        res.send({ message: 'Отзыв успешно опубликован' });
    } else {
        res.status(404).send({ message: 'Отзыв не найден' });
    }
});

// Отмена публикации отзыва
app.put('/reviews/:id/unpublish', (req, res) => {
    const reviewId = req.params.id;
    const data = readFromFile(jsonFileAdminPath); // Читаем данные из файла
    const reviews = data.admin[0].reviews; // Получаем массив отзывов
    const reviewIndex = reviews.findIndex(review => review.id === parseInt(reviewId)); // Находим индекс отзыва

    if (reviewIndex !== -1) {
        reviews[reviewIndex].isPublished = false; // Изменяем статус публикации

        // Сохраняем изменения в файл
        saveToFile(jsonFileAdminPath, data); // Записываем обновленные данные в файл

        res.send({ message: 'Отзыв успешно снят с публикации' });
    } else {
        res.status(404).send({ message: 'Отзыв не найден' });
    }
});

// Обновить имя пользователя
app.post('/updateName', (req, res) => {
    const { name, userId } = req.body;
    // console.log('Обновление имени для пользователя:', { userId, name });

    const users = readFromFile(jsonFilePath).users;
    const user = users.find(u => u.id === parseInt(userId));

    if (!user) {
        console.error('Пользователь не найден:', userId);
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.name = name; // Обновляем имя
    saveToFile(jsonFilePath, { users });
    res.status(200).json({ message: 'Имя обновлено' });
});

// Обновить фамилию пользователя
app.post('/updateSurname', (req, res) => {
    const { surname, userId } = req.body; // Изменено, чтобы получать userId
    const users = readFromFile(jsonFilePath).users;

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.surname = surname; // Обновляем фамилию
    saveToFile(jsonFilePath, { users });
    res.status(200).json({ message: 'Фамилия обновлена' });
});

// Обновить телефон пользователя
app.post('/updatePhone', (req, res) => {
    const { phone, userId } = req.body; // Изменено, чтобы получать userId
    const users = readFromFile(jsonFilePath).users;

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.phone = phone; // Обновляем телефон
    saveToFile(jsonFilePath, { users });
    res.status(200).json({ message: 'Телефон обновлен' });
});

// Обновить дату рождения пользователя
app.post('/updateBirthDate', (req, res) => {
    const { birthDate, userId } = req.body; // Получаем userId и birthDate из тела запроса
    // console.log('Обновление даты рождения для пользователя:', { userId, birthDate });

    const users = readFromFile(jsonFilePath).users;
    const user = users.find(u => u.id === parseInt(userId));

    if (!user) {
        console.error('Пользователь не найден:', userId);
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.birthDate = birthDate; // Обновляем дату рождения
    saveToFile(jsonFilePath, { users });
    res.status(200).json({ message: 'Дата рождения обновлена' });
});

// app.post('/updateProfileImage', upload.single('image'), (req, res) => {
//     const userId = req.body.userId; // Получаем userId из тела запроса
//     const file = req.file; // Получаем файл из запроса

//     if (!file || !userId) {
//         return res.status(400).json({ message: 'Файл или userId не переданы' });
//     }

//     res.status(200).json({ message: 'Изображение успешно обновлено', fileInfo: file });
// });

// app.get('/user/:id/profileImage', (req, res) => {
//     const userId = parseInt(req.params.id); // Преобразуем в число
//     const users = readFromFile(jsonFilePath).users;
//     const user = users.find(u => u.id === parseInt(userId));

//     if (!user || !user.profileImage) {
//         return res.status(404).json({ message: 'Пользователь не найден или изображения нет' });
//     }

//     // Формирование URL для изображения профиля
//     const imageUrl = `${req.protocol}://${req.get('host')}/${user.profileImage}`;
//     console.log("Ссылка", imageUrl);
//     res.json({ imageUrl }); // Отправляем URL изображения
// });
// // Обновить email пользователя
// app.post('/updateEmail', (req, res) => {
//     const { email, id } = req.body; // Получаем email и id из тела запроса
//     const users = readFromFile(jsonFilePath).users; // Читаем пользователей из файла

//     const user = users.find(u => u.id === parseInt(id)); // Находим пользователя по ID
//     if (!user) {
//         return res.status(404).json({ message: 'Пользователь не найден' });
//     }

//     user.email = email; // Обновляем email
//     saveToFile(jsonFilePath, { users }); // Сохраняем изменения в файл
//     res.status(200).json({ message: 'Email обновлен' }); // Возвращаем успех
// });

// Изменить пароль пользователя
app.post('/changePassword', async (req, res) => {
    const { oldPassword, newPassword, userId } = req.body;
    const users = readFromFile(jsonFilePath).users;

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Сравниваем старый пароль с хэшированным
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Неверный старый пароль' });
    }

    // Хэшируем новый пароль
    user.password = await bcrypt.hash(newPassword, 10);
    
    // Сохраняем изменения в файл
    saveToFile(jsonFilePath, { users });

    res.status(200).json({ message: 'Пароль успешно изменен' });
});

app.get('/users/:id/profile', (req, res) => {
    const userId = parseInt(req.params.id); // Получаем ID пользователя из параметров
    const users = readFromFile(jsonFilePath).users; // Читаем пользователей из файла

    // Находим пользователя по ID
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' }); // Если пользователь не найден, возвращаем 404
    }

    // Убираем пароль из ответа
    const { password, ...userProfile } = user; // Деструктурируем объект и убираем пароль
    res.json(userProfile); // Возвращаем профиль пользователя без пароля
});

app.get('/notes/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Получаем userId из параметров
    const data = readFromFile(jsonFilePath);
    const users = data.users;

    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Возвращаем заметки пользователя
    res.status(200).json({ notes: user.notes });
});

// Добавить новую заметку
app.post('/addNote', (req, res) => {
    console.log('Тело запроса:', req.body); 
    const { userId, name, description, priority, difficulty } = req.body;

    // Читаем данные из файла
    const data = readFromFile(jsonFilePath);
    const users = data.users;

    // Находим пользователя по userId
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Генерация нового ID для заметки
    const newId = user.notes.length ? user.notes[user.notes.length - 1].id + 1 : 1; 
    const newNote = { id: newId, name, description,priority, difficulty }; // Создание новой заметки
    user.notes.push(newNote); // Добавляем заметку в массив

    // Сохраняем изменения в файл
    saveToFile(jsonFilePath, data); 

    // Возвращаем успешный ответ
    res.status(201).json({ message: 'Заметка добавлена', notes: user.notes });
});

// Обновить заметку по ID
// Обновить заметку по ID
app.put('/updateNote/:id', (req, res) => {
    console.log('Тело запроса:', req.body); 
    const noteId = parseInt(req.params.id);
    const { name, description, priority, difficulty } = req.body;

    const data = readFromFile(jsonFilePath);
    const users = data.users;

    const user = users.find(u => u.notes.some(note => note.id === noteId));
    if (!user) {
        return res.status(404).json({ message: 'Заметка не найдена' });
    }

    const note = user.notes.find(note => note.id === noteId);
    if (!note) {
        return res.status(404).json({ message: 'Заметка не найдена' });
    }

    note.name = name.trim();
    note.description = description.trim();
    note.priority = priority.trim(); // Обработка приоритета
    note.difficulty = difficulty.trim();

    console.log('приоритет:', note.priority);
    console.log('сложность:', note.difficulty);

    console.log('Заметка перед обновлением:', JSON.stringify(note, null, 2)); 
    saveToFile(jsonFilePath, data);

    res.status(200).json({ message: 'Заметка обновлена' });
});

// Удалить заметку по ID
app.delete('/deleteNote/:id', (req, res) => {
    const noteId = parseInt(req.params.id);

    // Читаем данные из файла
    const data = readFromFile(jsonFilePath);
    const users = data.users;

    // Находим пользователя, у которого нужно удалить заметку
    const user = users.find(u => u.notes.some(note => note.id === noteId));
    if (!user) {
        return res.status(404).json({ message: 'Заметка не найдена' });
    }

    // Удаляем заметку
    user.notes = user.notes.filter(note => note.id !== noteId); // Удаление заметки по ID

    // Сохраняем изменения в файл
    saveToFile(jsonFilePath, data);

    // Возвращаем успешный ответ
    res.status(204).send(); // Отправка ответа без содержимого (204 No Content)
});



app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id); // Получаем идентификатор пользователя из URL
    const data = readFromFile(jsonFilePath); // Читаем данные из файла
    const users = data.users; // Получаем массив пользователей

    // Находим индекс пользователя по его ID
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Удаляем пользователя из массива
    users.splice(userIndex, 1);
    saveToFile(jsonFilePath, { users }); // Сохраняем обновленный массив обратно в файл
    res.status(204).send(); // Отправка ответа без содержимого (204 No Content)
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});