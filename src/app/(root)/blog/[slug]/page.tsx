/**
 * Created At: 2025.04.22:14:34:04
 * @author - @FL03
 * @file - page.tsx
 */
import { PostCard } from '@/features/blog';

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/lib/content/${slug}.mdx`);

  return (
    <PostCard>
      <Post />
    </PostCard>
  );
}
Page.displayName = 'BlogPostPage';

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'getting-started' }];
}
