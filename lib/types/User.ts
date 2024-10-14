export type UserBadge =
  | "admin"
  | "supporter"
  | "bat"
  | "developer"
  | "bot"
  | "champion";

export interface User {
  user_id: number;
  username: string;
  description?: string;
  country_code: string;
  register_date: string;
  last_online_time: string;
  restricted: boolean;
  silenced_until?: string;
  user_status: string;
  badges: UserBadge[];
}
