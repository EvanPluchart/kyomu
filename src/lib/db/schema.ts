import { index, integer, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#e8a030"),
  pin: text("pin"),
  theme: text("theme").notNull().default("dark"),
  accent: text("accent").notNull().default("Ambre"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export const series = sqliteTable("series", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  author: text("author"),
  publisher: text("publisher"),
  year: integer("year"),
  comicsCount: integer("comics_count").default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const comics = sqliteTable(
  "comics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    seriesId: integer("series_id")
      .notNull()
      .references(() => series.id),
    title: text("title").notNull(),
    number: real("number"),
    filePath: text("file_path").notNull().unique(),
    fileSize: integer("file_size").notNull(),
    fileMtime: integer("file_mtime").notNull(),
    format: text("format", { enum: ["cbz", "cbr", "pdf", "folder"] }).notNull(),
    pageCount: integer("page_count"),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_comics_series_id").on(table.seriesId),
    index("idx_comics_file_path").on(table.filePath),
    index("idx_comics_title").on(table.title),
  ],
);

export const readingProgress = sqliteTable(
  "reading_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    comicId: integer("comic_id")
      .notNull()
      .references(() => comics.id),
    profileId: integer("profile_id").references(() => profiles.id),
    currentPage: integer("current_page").notNull().default(0),
    totalPages: integer("total_pages").notNull().default(0),
    status: text("status", { enum: ["unread", "reading", "read"] })
      .notNull()
      .default("unread"),
    startedAt: text("started_at"),
    completedAt: text("completed_at"),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_progress_comic_profile").on(table.comicId, table.profileId),
    unique("uq_progress_comic_profile").on(table.comicId, table.profileId),
  ],
);

export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Series = typeof series.$inferSelect;
export type NewSeries = typeof series.$inferInsert;

export type Comic = typeof comics.$inferSelect;
export type NewComic = typeof comics.$inferInsert;

export type ReadingProgress = typeof readingProgress.$inferSelect;
export type NewReadingProgress = typeof readingProgress.$inferInsert;

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#e8a030"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const seriesTags = sqliteTable(
  "series_tags",
  {
    seriesId: integer("series_id")
      .notNull()
      .references(() => series.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (table) => [
    index("idx_series_tags_series").on(table.seriesId),
    index("idx_series_tags_tag").on(table.tagId),
  ],
);

export const authUsers = sqliteTable("auth_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  sessionToken: text("session_token"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type AppSettings = typeof appSettings.$inferSelect;
export type NewAppSettings = typeof appSettings.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type AuthUser = typeof authUsers.$inferSelect;
export type NewAuthUser = typeof authUsers.$inferInsert;
