/**
 * Created At: 2025-04-17
 * @author - Based on @FL03's design
 * @file - editable-height-weight.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Edit3Icon, Loader2Icon, SaveIcon, XIcon } from 'lucide-react';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type EditableValue = string | number;

// Add a function to update health profile fields (to be implemented in your API utilities)
type FieldEditorProps<TField extends string, TValue extends EditableValue> = {
  className?: string;
  defaultValue?: TValue;
  readonly?: boolean;
  field?: TField;
  fieldLabel?: string;
  showLabel?: boolean;
  onCancel?: () => void;
  onValueChange?(value: TValue): void;
  onValueSave?(value: TValue): void;
};

export function FieldEditor<
  TField extends string,
  TValue extends EditableValue,
>({
  className,
  defaultValue,
  field,
  fieldLabel,
  readonly,
  showLabel,
  onCancel,
  onValueChange,
  onValueSave,
}: FieldEditorProps<TField, TValue>) {
  const [_value, _setValue] = React.useState<TValue | undefined>(defaultValue);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  function handleOnChange(v: TValue) {
    if (onValueChange) onValueChange(v);
    _setValue(v);
  }

  function handleOnCancel(event: React.BaseSyntheticEvent) {
    // prevent the default action
    event.preventDefault();
    // prevent the event from bubbling up to parent elements
    event.stopPropagation();

    logger.trace(`Cancelling ${field} edit...`);
    // reset the value field to the default
    _setValue(defaultValue);
    // reset the editing state to false
    setIsEditing(false);
    // if the onCancel callback is provided, call it
    if (onCancel) onCancel();
  }

  async function handleOnSave(event: React.BaseSyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
    // ensure the saving state is set to true
    if (!isSaving) setIsSaving(true);
    // trace the event
    logger.trace({ data: _value }, `Saving ${field}...`);
    // try and handle the save

    toast.promise(
      async () => {
        try {
          if (_value && onValueSave) onValueSave(_value);
        } catch (error) {
          logger.error(
            { data: _value, error },
            `An error occurred while saving the ${field}`
          );
        } finally {
          setIsEditing(false);
          setIsSaving(false);
        }
      },
      {
        error: `An error occurred while saving the ${fieldLabel}`,
        loading: `Saving ${fieldLabel}...`,
        success: `${fieldLabel} updated successfully`,
      }
    );
  }

  const _Display = () => {
    return (
      <div className="flex flex-nowrap flex-1 w-full items-center gap-2">
        <div
          className="inline-flex flex-nowrap flex-1 w-full mr-auto gap-2"
          onDoubleClick={(event) => {
            // prevent the default action
            event.preventDefault();
            // prevent the event from bubbling up to parent elements
            event.stopPropagation();
            // Only allow editing if not readonly and not already editing
            if (!readonly && !isEditing) setIsEditing(true);
          }}
        >
          <span className="font-semibold">{_value}</span>
        </div>
        <Button
          disabled={readonly || isEditing || isSaving}
          className="ml-auto"
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
        >
          <Edit3Icon className="h-4 w-4" />
          <span className="sr-only">Edit {fieldLabel}</span>
        </Button>
      </div>
    );
  };

  const _Editor = () => {
    return (
      <div className="inline-flex items-center gap-2">
        <Input
          autoFocus
          disabled={!isEditing}
          readOnly={readonly}
          className="font-semibold h-9 w-24"
          type="number"
          min="0"
          step={field === 'height' ? '0.01' : '0.1'}
          value={_value}
          onChange={(event) => {
            event.preventDefault();

            const value = event.target.value;
            handleOnChange(value as TValue);
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' || (e.key === 'Enter' && e.shiftKey)) {
              await handleOnSave(e);
            } else if (e.key === 'Escape') {
              handleOnCancel(e);
            }
          }}
        />
        <Button disabled={isSaving} size="icon" onClick={handleOnSave}>
          {isSaving ? (
            <Loader2Icon className="animate-spin h-4 w-4" />
          ) : (
            <SaveIcon className="h-4 w-4" />
          )}
          <span
            className={cn(
              showLabel ? 'not-sr-only' : 'sr-only',
              isSaving && 'animate-pulse'
            )}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </span>
        </Button>
        <Button size="icon" variant="ghost" onClick={handleOnCancel}>
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-nowrap gap-2 items-center', className)}>
      <span className="text-muted-foreground font-semibold tracking-tighter">
        {fieldLabel}
      </span>
      {!readonly && isEditing ? <_Editor /> : <_Display />}
    </div>
  );
}
