// mdx-components.tsx
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-foreground text-3xl font-semibold tracking-tight prose-h1:default">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h1 className="text-foreground text-2xl font-semibold tracking-tight prose-h2:default">
        {children}
      </h1>
    ),
    h3: ({ children }) => (
      <h1 className="text-foreground text-xl font-semibold tracking-tight">
        {children}
      </h1>
    ),
    h4: ({ children }) => (
      <h1 className="text-foreground text-lg font-semibold tracking-tight">
        {children}
      </h1>
    ),
    h5: ({ children }) => (
      <h1 className="text-foreground font-semibold tracking-tight">
        {children}
      </h1>
    ),
    h6: ({ children }) => (
      <h1 className="text-foreground font-semibold italic tracking-tight">
        {children}
      </h1>
    ),
    p: ({ children }) => (
      <p className="text-foreground text-normal tracking-tight">{children}</p>
    ),
    a: ({ children }) => (
      <a className="text-blue-500 hover:text-blue-700 hover:underline">
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="inline-flex flex-col list-disc list-inside text-foreground text-normal tracking-tight">
        {children}
      </ul>
    ),
    ...components,
  };
}
