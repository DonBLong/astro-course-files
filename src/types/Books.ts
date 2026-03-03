export type TBook = {
  title: string;
  author: string[];
  cover: string | null;
  id: string;
  status: "reading" | "read" | "to_read";
}