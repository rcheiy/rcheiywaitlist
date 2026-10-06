import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Download, RefreshCw } from "lucide-react";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export default function AdminWaitlist() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const entriesQuery = trpc.waitlist.list.useQuery(undefined, { enabled: isAdmin });
  const entries = entriesQuery.data ?? [];

  function downloadCsv() {
    const rows = [["id", "name", "contact", "method", "message", "createdAt"], ...entries.map((entry) => [entry.id, entry.name, entry.contact, entry.method, entry.message, entry.createdAt])];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `rcheiy-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!loading && user && !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rcheiy / private index</p><h1 className="mt-3 text-3xl font-semibold">Admin access only</h1><p className="mt-2 text-sm text-muted-foreground">This page is reserved for the Rcheiy account owner.</p></div></div>;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
        <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rcheiy / private index</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Contact messages</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">Names, emails, phone numbers, and messages submitted through the right-side contact panel.</p></div><div className="flex gap-2"><button className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:bg-accent" type="button" onClick={() => entriesQuery.refetch()} disabled={entriesQuery.isFetching}><RefreshCw className={`h-4 w-4 ${entriesQuery.isFetching ? "animate-spin" : ""}`} />Refresh</button><button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={downloadCsv} disabled={!entries.length}><Download className="h-4 w-4" />Export CSV</button></div></div>
        {entriesQuery.error ? <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{entriesQuery.error.message || "You do not have permission to view this list."}</div> : null}
        <div className="overflow-x-auto rounded-xl border bg-card"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b bg-muted/40 text-xs uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="px-4 py-3">Received</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Message</th></tr></thead><tbody>{entriesQuery.isLoading ? <tr><td className="px-4 py-8 text-muted-foreground" colSpan={5}>Loading contacts…</td></tr> : entries.length ? entries.map((entry) => <tr className="border-b last:border-0" key={entry.id}><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</td><td className="px-4 py-4 font-medium">{entry.name || "—"}</td><td className="px-4 py-4">{entry.contact}</td><td className="px-4 py-4 capitalize text-muted-foreground">{entry.method}</td><td className="max-w-md px-4 py-4 text-muted-foreground">{entry.message || "—"}</td></tr>) : <tr><td className="px-4 py-12 text-center text-muted-foreground" colSpan={5}>No contacts yet.</td></tr>}</tbody></table></div>
      </div>
    </DashboardLayout>
  );
}
