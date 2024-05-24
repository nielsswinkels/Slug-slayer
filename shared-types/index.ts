export interface Session {
  id: string;
  createdAt: Date;
  date: Date;
  count: number;
  user: Parse.User;
}
