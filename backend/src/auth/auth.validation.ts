import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(3, "Password is too short"),

    firstName: z.string({
      required_error: "First name is required",
    }),

    lastName: z.string({
      required_error: "Last name is required",
    }),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(3, "Password is too short"),
  }),
});
