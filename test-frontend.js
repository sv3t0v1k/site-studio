// Проверка наличия frontend файлов
const fs = require('fs')
const path = require('path')

console.log('🔍 Проверка frontend файлов Noir Portfolio\n')

const requiredFiles = [
  'package.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/components/sections/Hero.tsx',
  'src/components/sections/Services.tsx',
  'src/components/sections/Projects.tsx',
  'src/components/sections/About.tsx',
  'src/components/sections/Contact.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'tailwind.config.ts',
  'next.config.js'
]

let allFilesExist = true

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - НЕ НАЙДЕН`)
    allFilesExist = false
  }
})

console.log('\n📊 Статус:')
if (allFilesExist) {
  console.log('✅ Все frontend файлы на месте!')
  console.log('\n🚀 Для запуска:')
  console.log('1. npm install')
  console.log('2. npx prisma generate')
  console.log('3. npx prisma db push')
  console.log('4. npm run db:seed')
  console.log('5. npm run dev')
  console.log('6. Открыть http://localhost:3000')
} else {
  console.log('❌ Некоторые файлы отсутствуют')
}

console.log('\n📁 Структура проекта:')
console.log('├── src/')
console.log('│   ├── app/                 # Next.js страницы')
console.log('│   ├── components/          # React компоненты')
console.log('│   │   ├── sections/        # Секции главной страницы')
console.log('│   │   ├── layout/          # Header/Footer')
console.log('│   │   ├── ui/              # UI компоненты')
console.log('│   │   └── common/          # Общие компоненты')
console.log('│   └── lib/                 # Утилиты и бизнес-логика')
console.log('├── prisma/                  # База данных')
console.log('├── public/                  # Статические файлы')
console.log('└── package.json             # Зависимости')
