/**
 * Created At: 2025-04-09:22:27:42
 * @author - @FL03
 * @file - page.tsx
 */
'use server';
// imports


type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string; }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  // const { view } = await searchParams;
  // render the page
  return (
    <div className="flex flex-col flex-1 min-h-full w-full gap-4">
      {/* Header */}
      <section className="flex flex-nowrap items-center w-full gap-2 lg:gap-4">
        <div className="inline-flex flex-col items-start w-full gap-2">
          <div className="text-3xl font-bold">Content</div>
          <span className="text-muted-foreground">
            View and manage all your digital assets in one place.
          </span>
        </div>
      </section>
      {/* Content */}
      <section>
        {username}
      </section>
    </div>
  );
}
Page.displayName = 'ContentManagerPage';

// export async function generateMetadata(
//   { params }: { params: Promise<{ alias: string }> },
//   parent: ResolvingMetadata
// ) {
//   const { alias } = await params;
//   return {
//     ...parent,
//     description: `The profile details for ${alias}`,
//     title: `@${alias}`,
//   };
// };
