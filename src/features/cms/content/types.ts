// types.ts
import { Database } from "@/types/database.types/database.blogger.types";

export type BloggerDatabase = Database;
/** The type of entry stored within the `blogger.posts` table */
export type ContentData = BloggerDatabase['blogger']['Tables']['posts']['Row'];
/** The type alias for inserting a new row within the posts table */
export type ContentDataInsert = BloggerDatabase['blogger']['Tables']['posts']['Insert'];
/** The type alias for updating a row within the posts table */
export type ContentDataUpdate = BloggerDatabase['blogger']['Tables']['posts']['Update'];
/** This type combines the various _views_ of entries within the posts table */
export type Content = ContentData | ContentDataInsert | ContentDataUpdate;