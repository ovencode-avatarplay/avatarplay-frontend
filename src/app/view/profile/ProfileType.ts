export interface Profile {
  id: number;
  type: string;
  avatar: string;
  name: string;
  status: string;
  isSelected: boolean;

  posts: number;
  followers: number;
  following: number;
}
