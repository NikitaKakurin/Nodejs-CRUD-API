# Nodejs-CRUD-API
Есть две ошибки:
1. Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.ts(2580)
2. Cannot find module 'http' or its corresponding type declarations.
Если установить  `npm i --save-dev @types/node` в директорию выше директории проекта то ошибок нет. Но и с этими ошибками TS компилируется и все работает
## Запуск приложения
- Development mode: npm run start:dev 
- Production mode: npm run start:prod 

## Запросы:
1. GET 
- /api/users или /api/users/ выводит всех пользователей
- /api/users/${id} выводит пользователя по id

2. POST
- /api/users или /api/users/,теле запроса необходимо отправить ключи username(строка), age(число), hobbies(массив строк) -в db создастся новый user c этими  ключами и значениями, ему присвоится рандомный id  

3. PUT
- /api/users/${id}, теле запроса можно отправить ключи username(строка), age(число), hobbies(массив строк) - редактирование данных пользователя с id

4. DELETE
- /api/users/${id}, теле запроса можно отправить ключи username(строка), age(число), hobbies(массив строк) - удаление пользователя с id из db.