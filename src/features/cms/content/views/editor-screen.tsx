'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
// project
import { cn } from '@/lib/utils';

type ViewProps = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

export const ContentEditorView: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> & ViewProps
> = ({
  ref,
  className,
  description = 'Create, view, or manage some digital content.',
  title = 'Content Editor',
  ...props
}) => {
  const Editor = dynamic(() => import('../widgets/content-editor'), {
    ssr: false,
  });
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-col flex-1 w-full px-4 py-2',
        className
      )}
    >
      <Editor {...props} />
    </div>
  );
};
ContentEditorView.displayName = 'ContentEditorView';

export default ContentEditorView;
