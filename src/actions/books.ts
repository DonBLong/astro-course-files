import type { OpenLibraryErrorResponse, OpenLibrarySuccessResponse } from "@/api/OpenLibrary";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { Books, db, eq } from "astro:db";
import { STATUS_CODES } from "node:http";

const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.array(z.string()).optional(),
  cover: z.string(),
  status: z.enum(["to_read", "reading", "read"]),
  isSaved: z.boolean(),
});

export type Book = typeof bookSchema._type;

export const books = {
  searchBooks: defineAction({
    input: z.object({
      search: z.string(),
    }),
    async handler({ search }) {
      const res = await fetch(`https://openlibrary.org/search.json?q=${search}&limit=6`);
      const result = await res.json();
      if (!res.ok) {
        const { detail }: OpenLibraryErrorResponse = result;
        const message = detail?.map(d => d.msg).join("\n");
        throw new ActionError({ code: STATUS_CODES[res.status] as ActionError["code"], message });
      }
      const { docs }: OpenLibrarySuccessResponse = result;
      return bookSchema.array().parse(
        await Promise.all(docs.map(async doc => {
          const id = doc.key.replaceAll("/works/", "");
          const [savedBook] = await db.select({ status: Books.status }).from(Books).where(eq(Books.id, id));
          return {
            id,
            title: doc.title,
            author: doc.author_name,
            cover: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
            status: savedBook?.status as Book["status"] ?? "to_read",
            isSaved: !!savedBook,
          };
        })),
      );
    },
  }),
  getAllSavedBooks: defineAction({
    async handler() {
      const books = await db.select().from(Books);
      return bookSchema.array().parse(books);
    },
  }),
  getSavedBookById: defineAction({
    input: bookSchema.pick({ id: true }),
    async handler({ id }) {
      const [book] = await db.select().from(Books).where(eq(Books.id, id));
      if (book == null) throw new ActionError({ code: "NOT_FOUND", message: "Book not found" });
      return bookSchema.parse(book);
    },
  }),
  saveBook: defineAction({
    accept: "form",
    input: bookSchema,
    async handler(book) {
      const [result] = await db.insert(Books).values({ ...book, isSaved: true }).returning({
        id: Books.id,
      });
      if (result == null) throw new ActionError({ code: "NOT_IMPLEMENTED", message: "Failed to save book" });
      return bookSchema.shape.id.parse(result.id);
    },
  }),
  removeBook: defineAction({
    accept: "form",
    input: bookSchema.pick({ id: true }),
    async handler({ id }) {
      const [result] = await db.delete(Books).where(eq(Books.id, id)).returning({ id: Books.id });
      if (result == null) throw new ActionError({ code: "NOT_FOUND", message: "Book not found" });
      return bookSchema.shape.id.parse(result.id);
    },
  }),
  removeAllBooks: defineAction({
    input: bookSchema.pick({ id: true }),
    async handler({ id }) {
      const [result] = await db.delete(Books).where(eq(Books.id, id)).returning({ id: Books.id });
      if (result == null) throw new ActionError({ code: "NOT_FOUND", message: "Book not found" });
      return bookSchema.shape.id.parse(result.id);
    },
  }),
  setStatus: defineAction({
    accept: "form",
    input: bookSchema.pick({ id: true, status: true }),
    async handler({ id, status }) {
      const [result] = await db.update(Books).set({ status }).where(eq(Books.id, id)).returning({
        id: Books.id,
        status: Books.status,
      });
      if (result == null) throw new ActionError({ code: "NOT_FOUND", message: "Book not found" });
      return bookSchema.pick({ id: true, status: true }).parse(result);
    },
  }),
};
