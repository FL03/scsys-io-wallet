// template.tsx
import { PropsWithChildren } from 'react';

/** 
 * The base template for the application; differs from a layout because of how it is rendered. 
 * Essentially, a layout is stacked on-top of some content whereas a template defines how each 
 * new instance should render. 
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#templates
 * @param {Readonly<PropsWithChildren>} props - the props for the template; note that children are readonly and required.
 */
export default function Template({ children }: Readonly<PropsWithChildren>) {
  return <div className="flex-1 h-full w-full">{children}</div>;
}
Template.displayName = 'AppTemplate';
