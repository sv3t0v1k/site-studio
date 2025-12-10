@echo off
echo 🚀 Noir Portfolio - Запуск проекта
echo ===================================

REM Проверка наличия Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен. Скачайте с https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js найден

REM Проверка наличия npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не найден
    pause
    exit /b 1
)

echo ✅ npm найден

REM Создание .env.local если не существует
if not exist ".env.local" (
    echo 📝 Создание .env.local...
    echo # Database (SQLite для тестирования)> .env.local
    echo DATABASE_URL="file:./dev.db">> .env.local
    echo.>> .env.local
    echo # JWT Secret>> .env.local
    echo JWT_SECRET="development-jwt-secret-key-replace-in-production">> .env.local
    echo JWT_EXPIRES_IN="7d">> .env.local
    echo.>> .env.local
    echo # Email Configuration (пустые для тестирования)>> .env.local
    echo SMTP_HOST="">> .env.local
    echo SMTP_USER="">> .env.local
    echo SMTP_PASS="">> .env.local
    echo.>> .env.local
    echo # Admin Configuration>> .env.local
    echo ADMIN_EMAIL="admin@noir.com">> .env.local
    echo ADMIN_PASSWORD="admin123">> .env.local
    echo.>> .env.local
    echo # Next.js>> .env.local
    echo NEXTAUTH_URL="http://localhost:3000">> .env.local
    echo ✅ Файл .env.local создан
)

REM Установка зависимостей
echo 📦 Установка зависимостей...
npm install
if errorlevel 1 (
    echo ❌ Ошибка установки зависимостей
    pause
    exit /b 1
)

echo ✅ Зависимости установлены

REM Генерация Prisma клиента
echo 🗄️ Настройка базы данных...
npx prisma generate
if errorlevel 1 (
    echo ❌ Ошибка генерации Prisma клиента
    pause
    exit /b 1
)

npx prisma db push --force-reset
if errorlevel 1 (
    echo ❌ Ошибка создания базы данных
    pause
    exit /b 1
)

echo ✅ База данных настроена

REM Заполнение данными
echo 🌱 Загрузка тестовых данных...
npm run db:seed
if errorlevel 1 (
    echo ❌ Ошибка загрузки данных
    pause
    exit /b 1
)

echo ✅ Тестовые данные загружены

echo.
echo 🎉 Настройка завершена!
echo.
echo 🚀 Запуск приложения...
echo.
echo 📱 Откройте в браузере: http://localhost:3000
echo 👨‍💻 Админ-панель: http://localhost:3000/admin/login
echo    Email: admin@noir.com
echo    Password: admin123
echo.
echo 📚 Для остановки нажмите Ctrl+C
echo.

REM Запуск приложения
npm run dev
