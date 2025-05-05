/**
 *
 * @author: @FL03
 * @file: avatar-picker.tsx
 */
'use client';
// imports
import * as React from 'react';
import { XIcon, UploadIcon, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// feature-specific
import { uploadAvatar } from '../utils';

type AvatarPickerProps = {
  defaultFileUrl?: string | null;
  showPreview?: boolean;
  previewSize?: number;
  onFileChange?: (file: File | null) => void;
};

export const AvatarPicker: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & AvatarPickerProps
> = ({
  ref,
  className,
  defaultFileUrl = null,
  previewSize = 128,
  showPreview,
  onFileChange,
  ...props
}) => {
  const [preview, setPreview] = React.useState<string | null>(defaultFileUrl);
  const [selected, setSelected] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      logger.warn('No files selected');
      return;
    }
    logger.info(`User selected ${e.target.files.length} files`);
    const file = e.target.files[0];
    // set the selected file
    setSelected(file);
    // create an object url for the file
    const imageUrl = URL.createObjectURL(file);
    // set the preview
    setPreview(imageUrl);
    // if onFileChange is provided, call it with the selected file
    if (onFileChange) onFileChange(file);
  };

  const handleClear = (event: React.BaseSyntheticEvent) => {
    // prevent the default action
    event.preventDefault();
    // stop the event from bubbling up
    event.stopPropagation();
    logger.info('Clearing selected file');
    // nullify the selected file
    setSelected(null);
    setPreview(defaultFileUrl);
  };

  const handleUpload = async (event: React.BaseSyntheticEvent) => {
    // prevent the default action
    event.preventDefault();
    // stop the event from bubbling up
    event.stopPropagation();
    // if
    if (!selected) {
      logger.error('No file selected for upload...');
      return;
    }
    // ensure the uploading toggle is triggered
    if (!isUploading) setIsUploading(true);
    // try to upload the file
    logger.info(`Uploading file ${selected.name}...`);
    try {
      const url = await uploadAvatar(selected);

      if (url) {
        toast.success('Avatar uploaded successfully');
        setPreview(url);
      }
    } catch (error) {
      logger.error({ error }, 'Error uploading the avatar');
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };
  // render the component
  return (
    <div {...props} ref={ref} className={cn('w-full', className)}>
      <div className="w-full flex flex-1 flex-wrap items-center justify-items-start gap-4">
        {showPreview && (
          <div
            className="relative flex-shrink-0 rounded-full overflow-hidden border"
            style={{ width: previewSize, height: previewSize }}
          >
            {preview && (
              <Image
                fill
                alt="Avatar preview"
                className="object-cover"
                src={preview}
              />
            )}
          </div>
        )}
        <div className="flex flex-col flex-1 gap-2 w-full">
          <Label
            htmlFor="avatar-input"
            className="text-muted-foreground text-nowrap"
          >
            Select Avatar Image
          </Label>
          <div className="inline-flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
            <Input
              id="avatar-input"
              className="w-full"
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
            <Button
              size="icon"
              variant="ghost"
              disabled={!selected || isUploading}
              onClick={handleClear}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          </div>
          <Button
            className="w-full"
            disabled={!selected || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                <span className="animate-pulse">Uploading...</span>
              </>
            ) : (
              <>
                <UploadIcon className="h-4 w-4" />
                <span>Upload</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
