/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../auth/index").Auth;
  type DatabaseUserAttributes = {
    email: string;
    name: string;
    picture: string;
  };
  type DatabaseSessionAttributes = {};
}
