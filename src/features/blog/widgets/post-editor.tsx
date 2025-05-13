'use client';
import * as React from 'react';
//  project
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BlogPost } from '../types';
import { FieldEditor } from '@/components/common/editor';

type PostEditorProps = {
  values?: BlogPost;
};

export const BlogPostEditor: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Card>, 'children' | 'title'> &
    PostEditorProps
> = ({ ref, className, values, ...props }) => {
  const [content, setContent] = React.useState<string>(values?.content ?? '');

  return (
    <Card
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-col flex-1 w-full px-4 py-2',
        className
      )}
    >
      <CardHeader className="flex flex-nowrap gap-4 items-center justify-between w-full">
        <div className="inline-flex flex-col flex-1 mr-auto">
          <FieldEditor
            className="font-semibold text-xl"
            field="title"
            fieldLabel="Title"
          />
          <FieldEditor
            className="text-muted-foreground text-sm"
            field="description"
            fieldLabel="Description"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 w-full">
        <div className="flex-1 w-full h-full">
          <Textarea defaultValue={content} onChange={() => {}} />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
BlogPostEditor.displayName = 'BlogPostEditor';

export default BlogPostEditor;
