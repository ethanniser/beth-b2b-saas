/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../auth/index").Auth;
  type DatabaseUserAttributes = {
    handle: string;
  };
  type DatabaseSessionAttributes = {};
}
