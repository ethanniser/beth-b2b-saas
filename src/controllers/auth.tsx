import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { set } from "zod";

class DuplicateEmailError extends Error {
  constructor() {
    super("Duplicate email");
  }
}

export const authController = new Elysia({
  prefix: "/auth",
})
  .use(ctx)
  .post(
    "/signup",
    async ({ body: { email, password }, auth, set }) => {
      const user = await auth
        .createUser({
          key: {
            providerId: "email", // auth method
            providerUserId: email.toLowerCase(), // unique id when using "email" auth method
            password, // hashed by Lucia
          },
          attributes: {
            email,
          },
        })
        .catch((err) => {
          if (err.code === "SQLITE_CONSTRAINT") {
            throw new DuplicateEmailError();
          } else {
            throw err;
          }
        });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      const sessionCookie = auth.createSessionCookie(session);

      set.headers["Set-Cookie"] = sessionCookie.serialize();
      set.redirect = "/profile";
    },
    {
      body: t.Object({
        email: t.String({
          minLength: 5,
          maxLength: 30,
        }),
        password: t.String({
          minLength: 6,
          maxLength: 255,
        }),
      }),
      error({ code, error, set }) {
        if (code === "VALIDATION") {
          console.log("sign up validation error");
          console.log(error);
          set.status = 400;
          return "Invalid email or password";
        } else if (error instanceof DuplicateEmailError) {
          console.log("sign up duplicate email error");
          console.log(error);
          set.status = 400;
          return "Email already exists";
        } else {
          console.log("sign up error");
          console.log(error);
          set.status = 500;
          return "Internal server error";
        }
      },
    }
  );
