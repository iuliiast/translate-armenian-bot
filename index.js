import dotenv from 'dotenv';
import TelegramBot from "node-telegram-bot-api";
dotenv.config();
const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const latin = {
  "a": "ա",
  "b": "բ",
  "g": "գ",
  "d": "դ",
  "e": "ե",
  "z": "զ",
  "e'": "է",
  "y'": "ը",
  "t'": "թ",
  "jh": "ժ",
  "i": "ի",
  "l": "լ",
  "x": "խ",
  "c'": "ծ",
  "k": "կ",
  "h": "հ",
  "d'": "ձ",
  "gh": "ղ",
  "tw": "ճ",
  "m": "մ",
  "y": "յ",
  "n": "ն",
  "sh": "շ",
  "o": "ո",
  "ch": "չ",
  "p": "պ",
  "j": "ջ",
  "r'": "ռ",
  "s": "ս",
  "v": "վ",
  "t": "տ",
  "r": "ր",
  "c": "ց",
  "w": "ւ",
  "p'": "փ",
  "q": "ք",
  "o'": "օ",
  "f": "ֆ",
  "u": "ու",
  "&": "և",
  "A": "Ա",
  "B": "Բ",
  "G": "Գ",
  "D": "Դ",
  "E": "Ե",
  "Z": "Զ",
  "E'": "Է",
  "Y'": "Ը",
  "T'": "Թ",
  "JH": "Ժ",
  "I": "Ի",
  "L": "Լ",
  "X": "Խ",
  "C'": "Ծ",
  "K": "Կ",
  "H": "Հ",
  "D'": "Ձ",
  "GH": "Ղ",
  "TW": "Ճ",
  "M": "Մ",
  "Y": "Յ",
  "N": "Ն",
  "SH": "Շ",
  "O": "Ո",
  "CH": "Չ",
  "P": "Պ",
  "J": "Ջ",
  "R'": "Ռ",
  "S": "Ս",
  "V": "Վ",
  "T": "Տ",
  "R": "Ր",
  "C": "Ց",
  "W": "Ւ",
  "P'": "Փ",
  "Q": "Ք",
  "O'": "Օ",
  "F": "Ֆ",
  "U": "ՈՒ",
  "&": "ԵՒ",
};
const reg =
  /a|b|g|d|e|z|e'|y'|t'|jh|i|l|x|c'|k|h|d'|gh|tw|m|y|n|sh|o|ch|p|j|r'|s|v|t|r|c|w|p'|q|o'|f|u|&|A|B|G|D|E|Z|E'|Y'|T'|JH|I|L|X|C'|K|H|D'|GH|TW|M|Y|N|SH|O|CH|P|J|R'|S|V|T|R|C|W|P'|Q|O'|F|U|&/g;

const makeTranslit = (str) => {
  const result = str.replace(reg, (chr) => latin[chr]);
  return result;
};

const targetLanguages = [
  [
    { text: "English", callback_data: "en" },
    { text: "Russian", callback_data: "ru" },
    { text: "Persian", callback_data: "fa" },
  ],
  [
    { text: "Georgian", callback_data: "ka" },
    { text: "Hindi", callback_data: "hi" },
  ],
];
let targetlang = "en";

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
	const convertedText = makeTranslit(text);
	const URL = `https://translate.google.com/?sl=hy&tl=${targetlang}&text=${convertedText}&op=translate`;
  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Hello! It is Translate Armenian Bot.\nIt helps to convert Latin letters to Armenian.\nSelect target language with /language."
    );
  } else if (text === "/language") {
    await bot.sendMessage(
      chatId,
      "Select the language you want to translate to.",
      {
        reply_markup: {
          inline_keyboard: targetLanguages,
        },
      }
    );
  } else {
    await bot.sendMessage(chatId, makeTranslit(text), {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Google Translate",
              url: encodeURI(URL)
            },
          ],
        ],
      },
    });
  }
});

bot.on("callback_query", (msg) => {
  const chatId = msg.message.chat.id;
  const data = msg.data;
  // console.log(msg);
  targetlang = data;
  bot.sendMessage(chatId, "Ok! Now translate the text.");
});
