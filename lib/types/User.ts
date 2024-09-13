export interface User {
  user_id: number;
  username: string;
  country_code: string;
  privilege: string;
  register_date: string;
  restricted: boolean;
  silenced_until: string | null;
  friends: number[];
}
