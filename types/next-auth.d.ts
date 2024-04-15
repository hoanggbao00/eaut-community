import { UserRole } from "@prisma/client";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string | null;
    role: UserRole;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      username?: string | null;
      role: UserRole;
    };
  }
}
