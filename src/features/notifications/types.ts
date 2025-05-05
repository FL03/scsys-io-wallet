/**
 * Created At: 2025-04-04:20:48:04
 * @author - @FL03
 * @description - types for notification related features
 * @file - types.ts
 */
import { Database, PublicTables } from '@/types/database.types';

export type NotificationData = PublicTables<'notifications'>;

export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

export type Notification = NotificationData | NotificationInsert | NotificationUpdate;