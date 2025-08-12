# Utility Tracker (Vite + React + TypeScript)

Учёт коммунальных услуг: несколько адресов, собственные тарифы, показания (Т1/Т2/Т3), платежи, статистика.  
Готов для импорта в ChatGPT **Codex** по ссылке GitHub.

## Локальный запуск
```bash
npm i
npm run dev
```

## Тесты
```bash
npm test
```

## Структура
- `src/pages/*` — страницы (Дашборд, Показания, Счётчики, Платежи, Статистика, Настройки)
- `src/components/*` — модальные окна и UI
- `src/utils.ts` — общие утилиты и миграция состояния
- `tests/*` — Vitest-проверки утилит

## Импорт в ChatGPT Codex
1. Создайте публичный репозиторий на GitHub, например `utility-tracker`.
2. Залейте файлы из этого проекта (см. ниже команды).
3. Откройте `https://chatgpt.com/codex` → **Create** → **Import from GitHub** → вставьте URL публичного репозитория.
4. В терминале Codex выполните:
   ```bash
   npm i
   npm run dev
   ```
   В превью откройте порт `5173`.

## Команды для публикации на GitHub
```bash
git init
git add .
git commit -m "feat: initial utility-tracker"
git branch -M main
# замените URL на свой новый пустой репозиторий
git remote add origin https://github.com/<your-user>/utility-tracker.git
git push -u origin main
```

## CI
Включён GitHub Actions: `Node.js CI` — установка, тесты и сборка на push/PR.