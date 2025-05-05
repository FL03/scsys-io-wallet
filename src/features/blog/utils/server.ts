// server.ts
'use server';
import { createServerClient } from "@/lib/supabase"
// feature-specific
import { BlogPostData, BloggerDatabase } from "../types";
import { upsertPostData } from "./queries";

export const createBloggerServerClient = async () => {
  return await createServerClient<BloggerDatabase, "blogger">("blogger");
}

export const upsertPostContent = async (values: BlogPostData, options?: { workdir?: string; }) => {
  const wd = options?.workdir || '@/content';
  const supabase = await createBloggerServerClient();

  const post = await upsertPostData(values, { client: supabase });


  const createFileName = (ext: string = 'mdx', ...dirs: string[]) => {
    const path = [wd, ...dirs].join('/');
    return `${path}/${values.slug}.${ext}`;
  }
  const localPath = createFileName('mdx', values.slug);
  const storagePath = createFileName('mdx', values.id);

  const bucketPath = (...path: string[]) => {
    return ['', ...path].join('/');
  }

  // const data = await supabase.storage.updateBucket();

  return post;
}