export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  gender?: string;
  photoURL?: string;
  status?: string;
  isProfileComplete?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  videoURL: string;
  thumbnail: string;
  caption: string;
  location: string;
  likesCount: number;
  createdAt: any;
  userName?: string;
  userPhoto?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  messageBody: string;
  timestamp: any;
}

export interface Sponsor {
  id: string;
  name: string;
  tagline: string;
  bannerImageURL: string;
  linkURL: string;
  priority: number;
}
