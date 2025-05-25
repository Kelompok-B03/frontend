interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  bio?: string;
  profilePictureUrl?: string;
}

export default RegisterRequest;