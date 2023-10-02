import { format, parse } from "date-fns";
import tr from "date-fns/locale/tr";

export const getDayName = (day: string) => {
  return format(parse(day, "dd.MM.yyyy", new Date()), "EEEE", { locale: tr });
};
