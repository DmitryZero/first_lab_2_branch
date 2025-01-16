Данный проект является лабораторной работой. Представляет из себя клиент-серверное приложение для тестирования задачи "Восстановление доминошек"
([Файл с проблемой.pdf](https://github.com/user-attachments/files/18441370/problem.pdf))

Для запуска проекта нужно установить следующее:
1) [Git]([https://git-scm.com]) - скачивать не обязательно. Нужен только, чтобы клонировать проект. Можно скачать исходники через интерфейс гитхаба
2) [NodeJS]([https://nodejs.org/en])
3) [pnpm]([https://pnpm.io])
4) [PostgreSQL]([https://www.postgresql.org/])

Для работы с проектом я использую [Visual Studio Code]([https://code.visualstudio.com])

1. Сначала с помощью Git скачиваем проект из GitHub.  В необходимой папке выполняем команду:

```bash
git clone https://github.com/DmitryZero/first_lab_2_branch.git
```

2. Открываем проект. У нас загрузились только файлы с кодом. Необходимо также загрузить файлы библиотек. Для этого в консоли пишем следующее:

```bash
npm install
```

![image](https://github.com/user-attachments/assets/43b16846-4e84-475a-93c1-b664fb8f4cc8)

3. В файле .env необходимо заполнить строку подключения к вашему PostgreSQL

```
DATABASE_URL="postgresql://postgres:somepassword@localhost:5432/mydb?schema=public"
```

4. Запускаем в консоли команду для запуска проекта

```bash
npm run dev
```

*Данная команда запускает скрипт "dev" из файла "package.json"*

5. После этого сервер запустится по адресу http://localhost:3000

Прикладываю отчёт по лабораторной работе [ЛР2- Никитин Д.А.docx](https://github.com/user-attachments/files/18442530/2-.docx)

