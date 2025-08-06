/**
 * User-related DTOs
 */

// User role enum
export type UserRole = 'USER' | 'ORG' | 'PARTNER' | 'ADMIN';


export type AppUser = {
  name: string;
  avatar: string;
};


export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  createdAt?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  preferredLocale?: string;
  // For consumers
  city?: string;
  // For partners
  parapharmacyId?: string;
}

export interface UserProfileUpdateDto {
  username?: string;
  email?: string;
  profilePicture?: string;
  city?: string;
  preferredLocale?: string;
}


export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

}

export interface ForgotPasswordDto {
  email: string;
}


export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserRegistrationDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
