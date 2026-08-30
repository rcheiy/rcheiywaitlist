import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { insertWaitlistEntry } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  waitlist: router({
    submit: publicProcedure
      .input(z.object({
        method: z.enum(["email", "phone"]),
        contact: z.string().trim().min(1).max(320),
      }))
      .mutation(async ({ input }) => {
        const contact = input.method === "email"
          ? input.contact.toLowerCase()
          : input.contact.replace(/[^+\d]/g, "");

        if (input.method === "email" && !/^\S+@\S+\.\S+$/.test(contact)) {
          throw new Error("Please enter a valid email address.");
        }
        if (input.method === "phone" && !/^[+\d][\d]{6,}$/.test(contact)) {
          throw new Error("Please enter a valid phone number.");
        }

        try {
          await insertWaitlistEntry({ method: input.method, contact });
        } catch (error) {
          if ((error as { code?: string }).code !== "ER_DUP_ENTRY") throw error;
        }

        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
