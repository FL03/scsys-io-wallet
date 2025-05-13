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

type EditorProps = {
  defaultValues?: {
    title: string;
    description: string;
    content: string;
  };
};

export const ContentEditor: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Card>, 'children' | 'title'> &
    EditorProps
> = ({ ref, className, defaultValues, ...props }) => {
  // destructure the default values
  const {
    content: defaultContent,
    description,
    title,
  } = defaultValues || { content: '', description: '', title: '' };

  const [_value, _setValue] = React.useState<string>(defaultContent);

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    // prevent the default behavior
    event.preventDefault();
    // prevent the event from bubbling up
    event.stopPropagation();
    // check if the event is not null
    if (!event || !event.target || !event.target.value) {
      return;
    }
    // get the value from the event
    const value = event.target.value;
    // set the value to the state
    _setValue(value);
  }

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
          <Textarea defaultValue={_value} onChange={handleContentChange} />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
ContentEditor.displayName = 'ContentEditor';

export default ContentEditor;
