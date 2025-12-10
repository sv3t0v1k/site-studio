const fs = require('fs')
const path = require('path')

console.log('🔍 Noir Portfolio - Проверка структуры проекта\n')
console.log('=' + '='.repeat(50))

const projectRoot = __dirname

// Проверяем основные файлы
const coreFiles = [
  'package.json',
  'README.md',
  'next.config.js',
  'tailwind.config.ts',
  'prisma/schema.prisma',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css'
]

console.log('📄 Основные файлы:')
coreFiles.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file))
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

console.log('\n🏗️  Структура папок:')

const directories = [
  'src',
  'src/app',
  'src/components',
  'src/components/sections',
  'src/components/layout',
  'src/components/ui',
  'src/lib',
  'prisma',
  'public'
]

directories.forEach(dir => {
  try {
    const items = fs.readdirSync(path.join(projectRoot, dir))
    console.log(`📁 ${dir}/ (${items.length} файлов)`)
  } catch (e) {
    console.log(`❌ ${dir}/ - не найден`)
  }
})

console.log('\n🎨 Компоненты секций:')
const sections = [
  'Hero.tsx',
  'Services.tsx',
  'Projects.tsx',
  'About.tsx',
  'Contact.tsx',
  'Blog.tsx',
  'Testimonials.tsx'
]

sections.forEach(section => {
  const exists = fs.existsSync(path.join(projectRoot, 'src/components/sections', section))
  console.log(`${exists ? '✅' : '❌'} ${section}`)
})

console.log('\n🔐 Аутентификация и админка:')
const adminFiles = [
  'src/app/admin/layout.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/login/page.tsx',
  'src/lib/auth/useAuth.ts',
  'src/middleware.ts'
]

adminFiles.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file))
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

console.log('\n📝 Rich Text Editor:')
const editorFiles = [
  'src/components/ui/rich-editor.tsx',
  'src/components/ui/html-renderer.tsx'
]

editorFiles.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file))
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

console.log('\n🚀 CI/CD файлы:')
const cicdFiles = [
  '.github/workflows/docker-deploy.yml',
  'docker-compose.prod.yml',
  'nginx.conf',
  'deploy.sh',
  'server-setup.sh'
]

cicdFiles.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file))
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

console.log('\n' + '='.repeat(50))
console.log('💡 Что делать дальше:')
console.log('')
console.log('1. 📱 Посмотреть демо-верстку:')
console.log('   Откройте demo.html в браузере')
console.log('')
console.log('2. 🚀 Запустить полную версию:')
console.log('   - Windows: start.bat')
console.log('   - macOS/Linux: ./setup.sh')
console.log('')
console.log('3. 🎯 После запуска:')
console.log('   - Главная: http://localhost:3000')
console.log('   - Админка: http://localhost:3000/admin/login')
console.log('   - Логин: admin@noir.com / admin123')
console.log('')
console.log('📚 Подробная документация: README.md')
