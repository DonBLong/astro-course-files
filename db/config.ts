import { column, defineDb, defineTable } from "astro:db";

const Books = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    author: column.json({ optional: true }),
    cover: column.text(),
    status: column.text(),
    isSaved: column.boolean(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Books },
});
