import js from "@eslint/js"
import globals from "globals"

export default [
  // Базовые рекомендуемые правила ESLint
  js.configs.recommended,
  
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,  // Подключаем Node.js глобальные переменные
        ...globals.es2021, // Добавляем ES2021 глобалы
        ...globals.jest,  // Добавляем Jest глобалы
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      // Ваши кастомные правила
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "never"]
    }
  },
  
  // Отдельная конфигурация для тестовых файлов
  {
    files: ["**/*.test.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.jest // Явно добавляем Jest-глобалы для тестов
      }
    }
  }
]