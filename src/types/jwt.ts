import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
    userId: string;
    username: string;
  }