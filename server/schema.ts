import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// {
//     id: 1,
//     slug: "post-1",
//     year: "1998",
//     publisher: "Robert Friedrich",
//     printed_country: "China",
//     illustrator: "Gwynedd M. Hudson",
//     ISBN: "0 90778 572 7",
//     price: "5",
//     purchased: "KW Books",
//     condition: "Good",
//     fact: "The book binding on this is beautiful, but the art is low-key terrifying.",
//   },

export const aliceTable = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  year: text("year").notNull(),
  publisher: text("publisher").notNull(),
  printedCountry: text("printed_country").notNull(),
  illustrator: text("illustrator").notNull(),
  ISBN: text("ISBN").notNull(),
  price: text("price").notNull(),
  purchased: text("purchased").notNull(),
  condition: text("condition").notNull(),
  fact: text("fact").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});


