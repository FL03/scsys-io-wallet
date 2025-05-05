/**
 * Created At: 2025-04-09:22:27:42
 * @author - @FL03
 * @file - page.tsx
 */
'use server';
// imports

export default async function Page() {
  return (
    <div className="flex flex-col flex-1 min-h-full w-full gap-4">
      {/* Header */}
      <section className="flex flex-nowrap items-center w-full gap-2 lg:gap-4">
        <div className="inline-flex flex-col items-start w-full gap-2">
          <h1 className="text-3xl font-bold">Profiles</h1>
          <span className="text-muted-foreground">Connect with other users!</span>
        </div>
      </section>
      {/* Content */}
      <section></section>
    </div>
  );
}
Page.displayName = 'ProfilePage';

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
