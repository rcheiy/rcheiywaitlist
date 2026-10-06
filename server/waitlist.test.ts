import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({ insertWaitlistEntry: vi.fn().mockResolvedValue(undefined), getWaitlistEntries: vi.fn().mockResolvedValue([]) }));
vi.mock("./db", () => mocks);

function createPublicContext(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}
function createUserContext(role: "admin" | "user"): TrpcContext {
  return { ...createPublicContext(), user: { id: 1, openId: "test", name: "Test", email: "test@example.com", loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } };
}

describe("waitlist.submit", () => {
  it("stores a normalized email through the database helper", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.waitlist.submit({ method: "email", contact: "  HELLO@EXAMPLE.COM " })).resolves.toEqual({ success: true });
    expect(mocks.insertWaitlistEntry).toHaveBeenCalledWith({ method: "email", contact: "hello@example.com", name: null, message: null });
  });
  it("stores a normalized phone number through the database helper", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.waitlist.submit({ method: "phone", contact: "(555) 123-4567" })).resolves.toEqual({ success: true });
    expect(mocks.insertWaitlistEntry).toHaveBeenCalledWith({ method: "phone", contact: "5551234567", name: null, message: null });
  });
  it("stores name and message from the contact drawer", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.waitlist.submit({ method: "email", contact: "hello@example.com", name: "Rae", message: "Let's work." })).resolves.toEqual({ success: true });
    expect(mocks.insertWaitlistEntry).toHaveBeenCalledWith({ method: "email", contact: "hello@example.com", name: "Rae", message: "Let's work." });
  });
  it("rejects malformed email input before attempting persistence", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.waitlist.submit({ method: "email", contact: "not-an-email" })).rejects.toThrow();
  });
  it("rejects malformed phone input before attempting persistence", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.waitlist.submit({ method: "phone", contact: "123" })).rejects.toThrow();
  });
  it("silently ignores the honeypot field", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.waitlist.submit({ method: "email", contact: "bot@example.com", website: "https://spam.test" })).resolves.toEqual({ success: true });
    expect(mocks.insertWaitlistEntry).not.toHaveBeenCalledWith(expect.objectContaining({ contact: "bot@example.com" }));
  });
});

describe("waitlist.list", () => {
  it("allows admin users to list contacts", async () => {
    const caller = appRouter.createCaller(createUserContext("admin"));
    await expect(caller.waitlist.list()).resolves.toEqual([]);
    expect(mocks.getWaitlistEntries).toHaveBeenCalled();
  });
  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));
    await expect(caller.waitlist.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
