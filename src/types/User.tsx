interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  phoneNumber?: string;
  bio?: string;
  profilePictureUrl?: string;
  walletId?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default User;