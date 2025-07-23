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
      // Updated rules to match Hexlet's checking system
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "quotes": ["error", "double"],
      "semi": ["error", "never"],
      "linebreak-style": ["error", "unix"],
      "no-trailing-spaces": "error",
      "max-len": ["error", { "code": 100 }],
      "no-console": "off",
      "import/extensions": "off",
      "no-underscore-dangle": "off"
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