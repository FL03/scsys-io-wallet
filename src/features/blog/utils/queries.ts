// queries.ts
'use server';
import { SupabaseClient } from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
// feature-specific
import { createBloggerServerClient } from "./server";
import { BlogPostData, BloggerDatabase } from "../types";

/**
 * Fetch all published blog posts from the database.
 * @returns {Promise<BlogPostData[]>} - A promise that resolves to an array of blog post data.
 */
export const getPosts = async (): Promise<BlogPostData[]> => {
  // initialize a server-side supabase client
  const supabase = await createBloggerServerClient();
  // get the posts from the database
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("published", true)
    .eq("private", false)
    .order("published_at", { ascending: false });
  // handle any errors
  if (error) {
    logger.error("Error fetching posts for user:", error.message);
    throw new Error(error.message);
  }
  logger.info(`Successfully fetched ${data?.length} entries...`);
  // return the data
  return data;
}

/**
 * Fetch all blog posts from the database for a specific user.
 * @returns {Promise<BlogPostData[]>} - A promise that resolves to an array of blog post data.
 */
export const getPostsForUser = async (username?: string): Promise<BlogPostData[]> => {
  if (!username) {
    logger.error("No username provided to the `getPostsForUser` callback; skipping query.");
    return [];
  }
  // initialize a server-side supabase client
  const supabase = await createBloggerServerClient();
  // get the posts from the database
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("creator", username)
    .order("updated_at", { ascending: false });
  // handle any errors
  if (error) {
    logger.error("Error fetching posts for user:", error.message);
    throw new Error(error.message);
  }
  // log the successful query
  logger.info(`Successfully fetched ${data?.length} entries...`);
  // return the data
  return data;
}

/**
 * Retrieve a particular post given its unique identifier.
 * @returns {Promise<BlogPostData>} - A promise that resolves to an array of blog post data.
 */
export const getPost = async (id?: string): Promise<BlogPostData> => {
  if (!id) {
    logger.error("No unique identifier provided to the `getPost` callback")
    throw new Error("No unique identifier provided to the `getPost` callback");
  }
  // initialize a server-side supabase client
  const supabase = await createBloggerServerClient();
  // get the posts from the database
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("id", id)
    .single();
  // handle any errors
  if (error) {
    logger.error("Error fetching posts for user:", error.message);
    throw new Error(error.message);
  }
  // log the successful query
  logger.info(`Successfully fetched the entry (${id}) from the database...`);
  // return the data
  return data;
}

export const upsertPostData = async (values: BlogPostData, options?: { client?: SupabaseClient<BloggerDatabase, "blogger">; }): Promise<BlogPostData> => {
  // unless previously provided, initialize a new server-side supabase client
  const supabase = options?.client || await createBloggerServerClient();

  const { data, error } = await supabase
    .from('posts')
    .upsert(values, { onConflict: 'id', count: 'exact' })
    .eq('id', values.id)
    .select()
    .single();
  // handle any errors from upserting the data
  if (error) {
    logger.error('Failed to upsert post content:', error.message);
    throw new Error(error.message);
  }
  // log the successful query
  logger.info(`Successfully upserted the entry (${values.id}) into the database...`);
  // return the stored data
  return data;
}