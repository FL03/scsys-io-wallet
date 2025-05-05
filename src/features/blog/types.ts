// types.ts
import { Database } from "@/types/database.types/database.blogger.types";

export type BloggerDatabase = Database;
/** The type of entry stored within the `blogger.posts` table */
export type BlogPostData = BloggerDatabase['blogger']['Tables']['posts']['Row'];
/** The type alias for inserting a new row within the posts table */
export type BlogPostDataInsert = BloggerDatabase['blogger']['Tables']['posts']['Insert'];
/** The type alias for updating a row within the posts table */
export type BlogPostDataUpdate = BloggerDatabase['blogger']['Tables']['posts']['Update'];
/** This type combines the various _views_ of entries within the posts table */
export type BlogPost = BlogPostData | BlogPostDataInsert | BlogPostDataUpdate;