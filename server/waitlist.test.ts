import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  insertWaitlistEntry: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./db", () => mocks);

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("waitlist.submit", () => {
  it("stores a normalized email through the database helper", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.waitlist.submit({ method: "email", contact: "  HELLO@EXAMPLE.COM " })).resolves.toEqual({ success: true });
    expect(mocks.insertWaitlistEntry).toHaveBeenCalledWith({ method: "email", contact: "hello@example.com" });
  });

  it("stores a normalized phone number through the database helper", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.waitlist.submit({ method: "phone", contact: "(555) 123-4567" })).resolves.toEqual({ success: true });
    expect(mocks.insertWaitlistEntry).toHaveBeenCalledWith({ method: "phone", contact: "5551234567" });
  });

  it("rejects malformed email input before attempting persistence", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.waitlist.submit({ method: "email", contact: "not-an-email" })).rejects.toThrow();
  });

  it("rejects malformed phone input before attempting persistence", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.waitlist.submit({ method: "phone", contact: "123" })).rejects.toThrow();
  });
});
