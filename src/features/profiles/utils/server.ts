/*
  Appellation: server <actions>
  Contrib: @FL03
*/
'use server';
// project
import { logger } from '@/lib/logger';
import { createServerClient, getUsername } from '@/lib/supabase';

export const fetchUserProfileAvatar = async (
  username: string
): Promise<File | null> => {
  const supabase = await createServerClient();
  // fetch the user
  const { data: profileData, error: dbError } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('username', username)
    .single();

  if (dbError) {
    logger.error(
      { error: dbError.message },
      'Unable to fetch the users avatar url from their profile...'
    );
    throw new Error(dbError.message);
  }

  if (!profileData || !profileData.avatar_url) {
    return null;
  }
  // fetch the avatar from the bucket
  const { data: storageData, error: storageError } = await supabase.storage
    .from('avatars')
    .download(profileData.avatar_url);

  if (storageError) {
    logger.error(
      { error: storageError.message },
      'Unable to fetch the users avatar from the bucket...'
    );
    throw new Error(storageError.message);
  }
  // convert the blob to a file
  const blob = new Blob([storageData], { type: storageData.type });
  const file = new File(
    [blob],
    `${username}.${storageData.type.split('/')[1]}`,
    {
      type: storageData.type,
    }
  );
  return file;
};
/**
 * Upload the file to the corresponding bucket and update the user's profile
 */
export const uploadAvatar = async (file?: File | null) => {
  const root = 'avatars';
  if (!file) return null;

  const supabase = await createServerClient();
  // fetch the user
  const username = await getUsername({ client: supabase, ssr: true });

  if (!username) {
    throw new Error('Error uploading avatar: user not found');
  }
  // name the bucket after the using the username
  const bucket = `${root}/${username}`;
  /// rename the file to username.extension
  const fname = `${username}.${file.name.split('.').pop()}`;
  // if the user doesn't have a bucket, create one
  if (!supabase.storage.from(root).exists(username)) {
    // create the object if one does not exist
    const { error: bucketError } = await supabase.storage.createBucket(bucket);
    // throw an error if the bucket creation fails
    if (bucketError) {
      logger.error(
        { error: bucketError.message },
        'Unable to create the users avatar bucket...'
      );
      throw new Error(bucketError.message);
    }
  }
  // upload the file to the bucket
  const { error: storageError } = await supabase.storage
    .from(bucket)
    .upload(fname, file, { upsert: true });
  // throw an error if the upload fails
  if (storageError) {
    logger.error(
      { error: storageError.message },
      'Unable to upload the users avatar to the bucket...'
    );
    throw new Error(storageError.message);
  }
  // get the public URL of the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fname);
  // update the user's profile with the new avatar URL
  const { error: dbError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('username', username);
  // throw an error if the update fails
  if (dbError) {
    logger.error(
      dbError,
      'Error updating the user profile with the new avatar...'
    );
    throw new Error(dbError.message);
  }
  // return the URL
  return publicUrl;
};
