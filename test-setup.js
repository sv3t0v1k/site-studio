// Quick test script to verify setup
const fs = require('fs')
const path = require('path')

console.log('🧪 Noir Portfolio - Проверка настройки\n')

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.log('❌ package.json не найден')
  process.exit(1)
}
console.log('✅ package.json найден')

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('⚠️  .env.local не найден - будет создан автоматически')
} else {
  console.log('✅ .env.local найден')
}

// Check if prisma schema exists
if (!fs.existsSync('prisma/schema.prisma')) {
  console.log('❌ prisma/schema.prisma не найден')
  process.exit(1)
}
console.log('✅ Prisma схема найдена')

// Check if SQLite is used
const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8')
if (schemaContent.includes('provider = "sqlite"')) {
  console.log('✅ SQLite настроен для разработки')
} else {
  console.log('⚠️  Рекомендуется использовать SQLite для тестирования')
}

// Check key directories
const dirs = ['src', 'src/app', 'src/components', 'prisma']
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ найден`)
  } else {
    console.log(`❌ ${dir}/ не найден`)
  }
})

console.log('\n🎯 Следующие шаги:')
console.log('1. Запустите: npm install')
console.log('2. Запустите: npx prisma generate')
console.log('3. Запустите: npx prisma db push')
console.log('4. Запустите: npm run db:seed')
console.log('5. Запустите: npm run dev')
console.log('6. Откройте http://localhost:3000')
console.log('7. Войдите в админку: admin@noir.com / admin123')

console.log('\n✨ Или просто используйте скрипт:')
console.log('   Linux/Mac: ./setup.sh')
console.log('   Windows: start.bat')
