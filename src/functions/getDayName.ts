import moment from "moment";
moment.locale("tr");

export const getDayName = (day: string) => {
  const dayToDate = moment(day, "DD.MM.YYYY");
  const dayName = dayToDate.format("dddd");

  return dayName;
};
