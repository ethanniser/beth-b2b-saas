/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../auth/index").Auth;
  type DatabaseUserAttributes = {
    email: string | null;
    name: string;
    picture: string;
    role: "admin" | "user";
    buisnessId?: number | null;
    createdAt: number;
    updatedAt?: Date | null;
  };
  type DatabaseSessionAttributes = {};
}
