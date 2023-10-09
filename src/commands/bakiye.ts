import { bot } from "@/bot";
import { parse as parseDate } from "date-fns";
import parse from "node-html-parser";
import axios from "axios";

// Types
import { CommandExecute, CommandMeta } from "@/@types/command";

const PAGE_URL = "http://hesap.alparslan.edu.tr//hesap.aspx";

export const execute: CommandExecute = async (message) => {
  const tckn = message.text.split(" ")[1];

  if (!tckn)
    return bot.sendMessage(
      message.chat.id,
      "⚠️ Lütfen komutun yanına TCKN bilginizi giriniz:\n\n`/bakiye 12345678901`",
      { parse_mode: "Markdown" }
    );
  else if (tckn.length !== 11 || isNaN(Number(tckn)))
    return bot.sendMessage(
      message.chat.id,
      "⚠️ Lütfen geçerli bir TCKN giriniz."
    );

  const pendingMessage = await bot.sendMessage(
    message.chat.id,
    "✨ Bakiyeniz sorgulanırken lütfen bekleyin..."
  );

  const initialPage = await axios.get(PAGE_URL).catch(null);

  if (initialPage.status !== 200)
    return bot.editMessageText(
      "❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
      {
        chat_id: pendingMessage.chat.id,
        message_id: pendingMessage.message_id,
      }
    );

  const root = parse(initialPage.data);

  const viewState = root.querySelector("#__VIEWSTATE")?.getAttribute("value");
  const viewStateGenerator = root
    .querySelector("#__VIEWSTATEGENERATOR")
    ?.getAttribute("value");
  const eventValidation = root
    .querySelector("#__EVENTVALIDATION")
    ?.getAttribute("value");

  const formData = {
    __VIEWSTATE: viewState,
    __VIEWSTATEGENERATOR: viewStateGenerator,
    __EVENTVALIDATION: eventValidation,
    TextBox1: tckn,
    DropDownList1: "Yemekhane",
  };

  const balancePage = await axios
    .post(PAGE_URL, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .catch(null);

  if (balancePage.status !== 200)
    return bot.sendMessage(
      message.chat.id,
      "❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz."
    );

  const balanceRoot = parse(balancePage.data);

  const balance = balanceRoot.querySelector("#LabelKalan")?.text;
  const totalSpent = balanceRoot.querySelector("#LabelToplamHarcanan")?.text;
  const totalTopUp = balanceRoot.querySelector("#LabelToplamYuklenen")?.text;

  const latestTransactions = balanceRoot
    .querySelectorAll("#GridView1 > tr:not(:first-child):not(:last-child)")
    .map((item) => {
      const [amount, date, time] = [
        item.querySelector("td:nth-child(4)")?.text,
        item.querySelector("td:nth-child(1)")?.text,
        item.querySelector("td:nth-child(2)")?.text,
      ];

      return {
        date,
        time,
        amount,
        type: "spending",
      };
    });

  const latestTopUps = balanceRoot
    .querySelectorAll("#GridView2 > tr:not(:first-child):not(:last-child)")
    .map((item) => {
      const [amount, date, time] = [
        item.querySelector("td:nth-child(4)")?.text,
        item.querySelector("td:nth-child(1)")?.text,
        item.querySelector("td:nth-child(2)")?.text,
      ];

      return {
        date,
        time,
        amount,
        type: "topup",
      };
    });

  const combinedTransactions: {
    date: string;
    time: string;
    amount: string;
    type: string;
    realDate?: Date;
  }[] = [...latestTransactions, ...latestTopUps];

  for (const transaction of combinedTransactions) {
    const dateTime = parseDate(
      `${transaction.date} ${transaction.time.split(" ")[0]}`,
      "d.MM.yyyy HH:mm:ss",
      new Date()
    );

    transaction.realDate = dateTime;
    transaction.date = dateTime.toLocaleString("tr-TR");
  }

  combinedTransactions.sort(
    (a, b) => b.realDate.getTime() - a.realDate.getTime()
  );

  const latestTransactionsText = combinedTransactions
    .slice(0, 6)
    .map((item) => {
      return `📅 ${item.date}\n💵 ${item.amount} ₺ (${
        item.type === "spending" ? "🔴" : "🟢"
      })\n`;
    });

  const text = `🟢 *Bakiye*: ${balance} ₺\n🔴 *Toplam Harcanan*: ${totalSpent} ₺\n🟡 *Toplam Yüklenen*: ${totalTopUp} ₺${
    latestTransactionsText.length > 0
      ? `\n\n🕙 *Son ${
          latestTransactionsText.length
        } İşlem*:\n\n${latestTransactionsText.join(
          "\n"
        )}\n🔴 Harcama - 🟢 Yükleme`
      : ""
  }`;

  return bot.editMessageText(text, {
    chat_id: pendingMessage.chat.id,
    message_id: pendingMessage.message_id,
    parse_mode: "Markdown",
  });
};

export const meta: CommandMeta = {
  command: "bakiye",
  description: "Kart bakiyenizi gösterir",
};
