#!/bin/bash

echo "🚀 Noir Portfolio - Настройка проекта"
echo "====================================="

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js версии 18 или выше."
    exit 1
fi

# Проверка версии Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js версии 18 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей"
    exit 1
fi

echo "✅ Зависимости установлены"

# Создание .env.local если не существует
if [ ! -f ".env.local" ]; then
    echo "📝 Создание .env.local..."
    cat > .env.local << EOL
# Database (SQLite для тестирования)
DATABASE_URL="file:./dev.db"

# JWT Secret (для разработки - замените в продакшене!)
JWT_SECRET="development-jwt-secret-key-replace-in-production-$(openssl rand -hex 32)"
JWT_EXPIRES_IN="7d"

# Email Configuration (для тестирования - оставьте пустым)
SMTP_HOST=""
SMTP_PORT=""
SMTP_SECURE=""
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="test@noir.com"

# Admin Configuration
ADMIN_EMAIL="admin@noir.com"
ADMIN_PASSWORD="admin123"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
EOL
    echo "✅ Файл .env.local создан"
else
    echo "ℹ️ Файл .env.local уже существует"
fi

# Генерация Prisma клиента
echo "🗄️ Настройка базы данных..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Ошибка генерации Prisma клиента"
    exit 1
fi

echo "✅ Prisma клиент сгенерирован"

# Применение миграций
echo "🗃️ Создание/обновление базы данных..."
npx prisma db push --force-reset

if [ $? -ne 0 ]; then
    echo "❌ Ошибка создания базы данных"
    exit 1
fi

echo "✅ База данных создана"

# Заполнение начальными данными
echo "🌱 Заполнение начальными данными..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Ошибка заполнения данными"
    exit 1
fi

echo "✅ Начальные данные загружены"

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "🚀 Для запуска выполните:"
echo "   npm run dev"
echo ""
echo "📱 Затем откройте в браузере:"
echo "   http://localhost:3000"
echo ""
echo "👨‍💻 Админ-панель:"
echo "   http://localhost:3000/admin/login"
echo "   Email: admin@noir.com"
echo "   Password: admin123"
echo ""
echo "📚 Документация: README.md"
