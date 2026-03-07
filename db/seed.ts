import { Books, db } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Books).values([
    {
      id: "1",
      title: "whatever",
      author: ["joe"],
      cover: "https://covers.openlibrary.org/b/id/10110415-M.jpg",
      status: "reading",
      isSaved: true,
    },
  ]);
}
