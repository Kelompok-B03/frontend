export interface PublicUserProfile {
  id: string;
  name: string;
  profilePictureUrl?: string | null;
  bio?: string | null;
  memberSince: string;
}