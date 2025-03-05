import telebot
from telebot import types

# Токен бота
BOT_TOKEN = '7259428937:AAEgPf8Mi2-5CBi4Y7deTYYlGbjp9GQ9540'

# Инициализация бота
bot = telebot.TeleBot(BOT_TOKEN)

# Обработчик команды /start
@bot.message_handler(commands=['start'])
def send_welcome(message):
    # Создаем клавиатуру с кнопкой
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_app_button = types.KeyboardButton(
        text="Открыть мини-приложение",
        web_app=types.WebAppInfo(url="https://coinmced.beget.tech/")
    )
    keyboard.add(web_app_button)

    # Отправляем сообщение с текстом и клавиатурой
    bot.send_message(
        message.chat.id,
        "Привет! Нажми кнопку ниже, чтобы открыть мини-приложение:",
        reply_markup=keyboard
    )

# Функция, вызываемая при запуске бота
def on_startup():
    print("Бот запущен!")

# Запуск бота
if __name__ == '__main__':
    on_startup()
    bot.polling(none_stop=True)