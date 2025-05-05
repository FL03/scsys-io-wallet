/**
 * Notification List Component
 * Created At: 2025-04-09:07:42:06
 * @author - @FL03
 * @description - This component displays a list of notifications for the user.
 * @file - notification-list.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// feature-specific
import { Notification } from '../types';
// components
import {
  UList,
  ListTile,
  TileContent,
  TileLeading,
  TileTrailing,
} from '@/components/common/list-view';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const NotificationListItem: React.FC<
  Omit<React.ComponentProps<typeof ListTile>, 'onClick'> & {
    item?: Notification | null;
    onClick?: (item: Notification) => void;
    onSelected?: (item: Notification) => void;
  }
> = ({ className, item, variant="card", onClick, onSelected, ...props }) => {
  // local state
  const [selected, setSelected] = React.useState(false);

  if (!item) return null;
  const { message } = item;

  const handleClick = (event: React.BaseSyntheticEvent) => {
    // prevent the default action of the checkbox
    event.preventDefault();
    // prevent the event from bubbling up to the list item
    event.stopPropagation();
    // handle click event here
    logger.trace(event, 'Handling the click event for a notification...');
    // handle select event here
    setSelected((prev) => !prev);
    // finish out by calling the onClick prop if it exists
    if (onClick) onClick(item);
  };

  const handleSelect: React.MouseEventHandler<HTMLButtonElement> = (
    event: React.BaseSyntheticEvent
  ) => {
    // prevent the default action of the checkbox
    event.preventDefault();
    // prevent the event from bubbling up to the list item
    event.stopPropagation();
    // handle select event here
    logger.trace(event, 'Handling the select event for a notification...');
    // toggle the selected state
    setSelected((prev) => !prev);
    // call the onSelected callback if possible
    if (onSelected) onSelected(item);
    
  };

  return (
    <ListTile
      className={cn('w-full h-fit', className)}
      onClick={handleClick}
      {...props}
    >
      <TileLeading>
        <Checkbox checked={selected} onClick={handleSelect} />
      </TileLeading>
      <TileContent>{message}</TileContent>
      <TileTrailing className="inline-block h-full ml-auto ">
        <Badge>{item.status}</Badge>
      </TileTrailing>
    </ListTile>
  );
};
NotificationListItem.displayName = 'NotificationListItem';

export const NotificationList: React.FC<
  React.ComponentPropsWithRef<typeof UList> & { items?: Notification[] }
> = ({ ref, className, items = [], ...props }) => {
  return (
    <UList {...props} ref={ref} className={cn('w-full h-full', className)}>
      {items.map((item, index) => (
        <NotificationListItem key={index} item={item} />
      ))}
    </UList>
  );
};
NotificationList.displayName = 'NotificationList';

export default NotificationList;
