var data = require('./data.json')

const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
let bot;
let isLogged;
let day = 1;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

function description(title, text) {
  if (!!text) {
    return '\n' + '<b>' + title + '</b>\n' + text
  }
  return null
}

function currentDayPrediction(day) {
  const title = data[day]["title"]
  const physiology = description("физиология", data[day]["physiology"])
  const mood = description("настроение", data[day]["mood"])
  const energy = description("энергия", data[day]["energy"])
  const food = description("питание", data[day]["food"])
  return [title, physiology, mood, energy, food].join('\n')
}

bot.on('message', (msg) => {
  if (isLogged) {
    const parsedDay = parseInt(msg.text)
    if (!!parsedDay && parsedDay >= 1 && parsedDay <= 28) {
      day = parsedDay
    } else {
      bot.sendMessage(msg.chat.id, "Введите день цикла от 1 до 28");
      return
    }
    // bot.sendMessage(msg.chat.id, "День: " + day);
    bot.sendMessage(msg.chat.id, currentDayPrediction(day), {parse_mode: "HTML"});
  } else {
    if (msg.text === '1') {
      isLogged = true
      bot.sendMessage(msg.chat.id, "Введите день цикла от 1 до 28");
    } else {
      bot.sendMessage(msg.chat.id, "Для продолжения введи, пожалуйста, пароль:");
    }
  }
  // }
});



module.exports = bot;
