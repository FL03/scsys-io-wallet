// image-picker.tsx
'use client';
// imports
import * as React from 'react';
import Image from 'next/image';
import { Loader2Icon, UploadIcon, XIcon } from 'lucide-react';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImagePickerProps {
  initialImage?: string | null;
  onImageSelect?: (file: File | null) => void;
  onImageUpdate?: (file: File | null) => void;
  className?: string;
  previewSize?: number;
}

export function ImagePicker({
  initialImage = null,
  onImageSelect,
  onImageUpdate,
  className = '',
  previewSize = 100,
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(
    initialImage
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  const handleCancel = () => {
    setSelectedImage(initialImage);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  const handleUpdate = () => {
    if (!selectedFile) {
      logger.warn('No file selected for upload');
      return;
    }
    if (!isUploading) setIsUploading(true);

    try {
      if (onImageUpdate) {
        onImageUpdate(selectedFile);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Image Preview */}
        <div
          className="relative flex-shrink-0 rounded-md overflow-hidden border bg-muted"
          style={{ width: previewSize, height: previewSize }}
        >
          {selectedImage ? (
            <Image
              src={selectedImage || '/placeholder.svg'}
              alt="Selected image preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Input and Controls */}
        <div className="flex-1 w-full">
          {/* Input and Cancel Button Row */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="flex-shrink-0"
              aria-label="Cancel selection"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Update Button */}
          <Button
            className="w-full"
            disabled={!selectedFile}
            onClick={handleUpdate}
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
}
