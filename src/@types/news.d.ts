export interface NewsOrAnnouncements {
  title: string;
  description: string;
  link: string;
  date: string;
  type?: "news" | "announcement";
}
