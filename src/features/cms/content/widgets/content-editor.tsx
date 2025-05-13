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

type ContentEditorData = {
  title?: string;
  description?: string;
  content?: string;
};

type ContentEditorProps = {
  contentData?: ContentEditorData;
};

export const ContentEditor: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Card>, 'children' | 'title'> &
    ContentEditorProps
> = ({ ref, className, contentData, ...props }) => {
  const [content, setContent] = React.useState<string>(contentData?.content ?? '');
  const [title, setTitle] = React.useState<string>(
    contentData?.content ?? ''
  );
  const [description, setDescription] = React.useState<string>(
    contentData?.content ?? ''
  );

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
            <CardTitle className="font-semibold text-xl tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 w-full">
        <div className="flex-1 w-full h-full">
          <Textarea defaultValue={content} />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
ContentEditor.displayName = 'ContentEditor';

export default ContentEditor;
