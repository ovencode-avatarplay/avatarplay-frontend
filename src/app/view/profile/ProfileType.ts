export interface Profile {
  id: number;
  avatar: string;
  userName: string;
  status: 'Original' | 'Fan' | '';
  isSelected: boolean;
}
