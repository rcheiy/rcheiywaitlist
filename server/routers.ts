import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { getWaitlistEntries, insertWaitlistEntry } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  waitlist: router({
    submit: publicProcedure.input(z.object({
      method: z.enum(["email", "phone"]),
      contact: z.string().trim().min(1).max(320),
      name: z.string().trim().max(120).optional(),
      message: z.string().trim().max(5000).optional(),
      website: z.string().max(120).optional(),
    })).mutation(async ({ input }) => {
      if (input.website) return { success: true } as const;
      const contact = input.method === "email" ? input.contact.toLowerCase() : input.contact.replace(/[^+\d]/g, "");
      if (input.method === "email" && !/^\S+@\S+\.\S+$/.test(contact)) throw new Error("Please enter a valid email address.");
      if (input.method === "phone" && !/^[+\d][\d]{6,}$/.test(contact)) throw new Error("Please enter a valid phone number.");
      try {
        await insertWaitlistEntry({ method: input.method, contact, name: input.name?.trim() || null, message: input.message?.trim() || null });
      } catch (error) {
        if ((error as { code?: string }).code !== "ER_DUP_ENTRY") throw error;
      }
      return { success: true } as const;
    }),
    list: adminProcedure.query(() => getWaitlistEntries()),
  }),
});

export type AppRouter = typeof appRouter;
