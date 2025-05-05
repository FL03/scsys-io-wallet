// helpers.ts
import { createBrowserClient } from "@/lib/supabase"
import { BloggerDatabase } from "../types"

export const createBloggerBrowserClients = () => {
  return createBrowserClient<BloggerDatabase, "blogger">("blogger");
}

