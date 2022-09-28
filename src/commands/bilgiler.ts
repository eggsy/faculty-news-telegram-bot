import bot from "../structures/Bot";

// Types
import { CommandExecute, CommandMeta } from "../@types/command";

export const execute: CommandExecute = (message) => {
  bot.sendMessage(
    message.chat.id,
    `📚 *Muş Alparslan Üniversitesi Eğitim Fakültesi*

*Dekan:* Prof. Dr. Esin Kaya
*Dekan Yardımcıları*: Dr. Öğr. Üyesi Ahmet Battal － Doç. Dr. Ayça Kartal
*Fakülte Sekreteri:* Ali Çobanlı

__Faydalı Bağlantılar:__
🔗 [Fakülte Websitesi](https://egitimf.alparslan.edu.tr)
💌 [Fakülte İletişim](http://egitimf.alparslan.edu.tr/tr/contact)
✨ [Fakülte Instagram](https://instagram.com/maunegitim)
📅 [Akademik Takvim](https://www.alparslan.edu.tr/documents/1653573643.pdf)`,
    {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    }
  );
};

export const meta: CommandMeta = {
  command: "bilgiler",
  description: "Fakültemiz hakkında bilgileri gösterir.",
};
