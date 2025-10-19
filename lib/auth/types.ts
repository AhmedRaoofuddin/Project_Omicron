/**
 * Unified auth types that work in both DEMO and PRODUCTION modes
 */

export interface DemoUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  username: string | null;
  role?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  imageUrl: string;
}

