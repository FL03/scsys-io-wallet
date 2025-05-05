// imports
import { v4 } from 'uuid';
// feature-specific
import { ProfileData } from '../types';

/**
 * The UserProfile class represents a user profile and is used to manage user data.
 */
export class UserProfile {
  _id: string;
  _username: string;
  _avatar: string;
  _email: string[] = [];
  _first_name?: string;
  _last_name?: string;
  _bio?: string;
  _location?: string;
  _website?: string;
  _socials?: string[];
  _created_at?: Date;
  _updated_at?: Date;

  constructor(values?: Partial<ProfileData>) {
    this._id = values?.id ?? v4();
    this._username = values?.username ?? '';
    this._avatar = values?.avatar_url ?? '/default-avatar.png';
    this._email = values?.email ?? [];
  }

  // getters
  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get avatar(): string {
    return this._avatar;
  }

  get email(): string[] {
    return this._email;
  }
}
