import React, { useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  Heart,
  History,
  Lock,
  LogOut,
  Package,
  Plus,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Star,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { MiniKpi } from "./MiniKpi";

type TabKey =
  | "overview"
  | "todos"
  | "orders"
  | "payments"
  | "activity"
  | "likes"
  | "security"
  | "settings";

type Todo = {
  id: string;
  title: string;
  due?: string; // ISO date
  done: boolean;
};

type Order = {
  id: string;
  date: string;
  status: "Paid" | "Pending" | "Refunded";
  total: number;
  items: { name: string; qty: number }[];
};

type PaymentMethod = {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex" | "PayPal" | "Bank";
  last4?: string;
  expiry?: string; // MM/YY
  isDefault?: boolean;
};

type ActivityItem = {
  id: string;
  time: string;
  title: string;
  detail?: string;
  icon?: React.ReactNode;
};

type LikeItem = {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (a + b).toUpperCase();
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-800 ring-amber-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    info: "bg-sky-50 text-sky-700 ring-sky-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

function Card({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        className
      )}
    >
      {(title || subtitle || right) && (
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div className="min-w-0">
            {title && (
              <div className="truncate text-sm font-semibold text-zinc-900">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
            )}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-700 hover:bg-zinc-100"
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl ring-1 ring-inset transition",
            active
              ? "bg-white/10 ring-white/15"
              : "bg-white ring-zinc-200 group-hover:ring-zinc-300"
          )}
        >
          <span className={cn(active ? "text-white" : "text-zinc-700")}>
            {icon}
          </span>
        </span>
        <span className="truncate">{label}</span>
      </span>
      {badge && <span className="shrink-0">{badge}</span>}
    </button>
  );
}

export default function ProfileDashboardCenter() {
  // Replace these with real data (props / API / context).
  const [tab, setTab] = useState<TabKey>("overview");
  const [search, setSearch] = useState("");
  const [todos, setTodos] = useState<Todo[]>([
    { id: "t1", title: "Finish onboarding checklist", due: "2026-01-05", done: false },
    { id: "t2", title: "Add a payment method", due: "2026-01-07", done: true },
    { id: "t3", title: "Review purchase history", done: false },
    { id: "t4", title: "Enable 2FA for extra security", done: false },
  ]);

  const orders: Order[] = useMemo(
    () => [
      {
        id: "ORD-10421",
        date: "2025-12-20",
        status: "Paid",
        total: 129.99,
        items: [
          { name: "Pro subscription", qty: 1 },
          { name: "Extra storage add-on", qty: 1 },
        ],
      },
      {
        id: "ORD-10388",
        date: "2025-11-24",
        status: "Refunded",
        total: 49.0,
        items: [{ name: "Starter plan", qty: 1 }],
      },
      {
        id: "ORD-10302",
        date: "2025-10-02",
        status: "Paid",
        total: 19.99,
        items: [{ name: "One-time report", qty: 1 }],
      },
    ],
    []
  );

  const paymentMethods: PaymentMethod[] = useMemo(
    () => [
      { id: "pm1", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
      { id: "pm2", brand: "Mastercard", last4: "4444", expiry: "02/29" },
      { id: "pm3", brand: "PayPal" },
    ],
    []
  );

  const activity: ActivityItem[] = useMemo(
    () => [
      {
        id: "a1",
        time: "Today • 10:14",
        title: "Logged in",
        detail: "New session from Chrome • macOS",
        icon: <User className="h-4 w-4" />,
      },
      {
        id: "a2",
        time: "Yesterday • 18:02",
        title: "Updated profile",
        detail: "Changed display name",
        icon: <Edit3 className="h-4 w-4" />,
      },
      {
        id: "a3",
        time: "Dec 18 • 09:20",
        title: "Payment succeeded",
        detail: "ORD-10421 • Visa •••• 4242",
        icon: <Receipt className="h-4 w-4" />,
      },
      {
        id: "a4",
        time: "Dec 10 • 14:55",
        title: "Added a liked item",
        detail: "Saved “Dashboard UI pack”",
        icon: <Heart className="h-4 w-4" />,
      },
    ],
    []
  );

  const likes: LikeItem[] = useMemo(
    () => [
      { id: "l1", title: "Dashboard UI pack", subtitle: "Design assets", tag: "Saved" },
      { id: "l2", title: "Productivity templates", subtitle: "Docs & checklists", tag: "Pinned" },
      { id: "l3", title: "API quickstart", subtitle: "Developer guide", tag: "Saved" },
      { id: "l4", title: "Billing FAQ", subtitle: "Help article", tag: "Saved" },
    ],
    []
  );

  const user = {
    name: "Zetaslate User",
    email: "user@zetaslate.com",
    plan: "Pro",
    memberSince: "2025-08-11",
    locale: "en-US",
    timezone: "UTC",
  };

  const todoStats = useMemo(() => {
    const done = todos.filter((t) => t.done).length;
    const total = todos.length;
    return { done, total, remaining: total - done };
  }, [todos]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q)) ||
        o.status.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const filteredActivity = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activity;
    return activity.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.detail ?? "").toLowerCase().includes(q)
    );
  }, [activity, search]);

  const filteredLikes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return likes;
    return likes.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.subtitle ?? "").toLowerCase().includes(q) ||
        (l.tag ?? "").toLowerCase().includes(q)
    );
  }, [likes, search]);

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function addTodo() {
    const title = prompt("New to-do");
    if (!title?.trim()) return;
    setTodos((prev) => [{ id: `t${Date.now()}`, title: title.trim(), done: false }, ...prev]);
    setTab("todos");
  }

  const tabs: Array<{
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    badge?: React.ReactNode;
  }> = useMemo(
    () => [
      { key: "overview", label: "Overview", icon: <Star className="h-4 w-4" /> },
      {
        key: "todos",
        label: "To-dos",
        icon: <CheckCircle2 className="h-4 w-4" />,
        badge: (
          <Badge tone={todoStats.remaining ? "warning" : "success"}>
            {todoStats.remaining} left
          </Badge>
        ),
      },
      { key: "orders", label: "Purchase history", icon: <Package className="h-4 w-4" /> },
      { key: "payments", label: "Payment methods", icon: <CreditCard className="h-4 w-4" /> },
      { key: "activity", label: "Activity", icon: <History className="h-4 w-4" /> },
      { key: "likes", label: "Likes & saves", icon: <Heart className="h-4 w-4" /> },
      { key: "security", label: "Security", icon: <ShieldCheck className="h-4 w-4" /> },
      { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    ],
    [todoStats.remaining]
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top header row (sits in the middle area; your global header/nav stays outside) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-900 text-white shadow-sm">
            <span className="text-sm font-semibold">{initials(user.name)}</span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold text-zinc-900">
                {user.name}
              </h1>
              <Badge tone="info">
                <Wallet className="h-3.5 w-3.5" />
                {user.plan}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-zinc-500">{user.email}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, activity, likes…"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 md:w-80"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addTodo}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              New to-do
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left sidebar tabs */}
        <div className="space-y-3">
          <Card
            title="Dashboard"
            subtitle="Navigate your account areas"
            right={<Badge tone="neutral">{new Date().toLocaleDateString()}</Badge>}
          >
            <div className="flex flex-col gap-1">
              {tabs.map((t) => (
                <TabButton
                  key={t.key}
                  active={tab === t.key}
                  onClick={() => setTab(t.key)}
                  icon={t.icon}
                  label={t.label}
                  badge={t.badge}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-3">
              <div className="text-xs text-zinc-600">
                <div className="font-semibold text-zinc-900">Member since</div>
                <div className="mt-0.5">{user.memberSince}</div>
              </div>
              <Calendar className="h-4 w-4 text-zinc-500" />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </Card>

          <Card title="Quick stats" subtitle="A snapshot of your account">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="text-xs text-zinc-500">To-dos done</div>
                <div className="mt-1 text-lg font-semibold text-zinc-900">
                  {todoStats.done}/{todoStats.total}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="text-xs text-zinc-500">Orders</div>
                <div className="mt-1 text-lg font-semibold text-zinc-900">
                  {orders.length}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="text-xs text-zinc-500">Payment methods</div>
                <div className="mt-1 text-lg font-semibold text-zinc-900">
                  {paymentMethods.length}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="text-xs text-zinc-500">Likes</div>
                <div className="mt-1 text-lg font-semibold text-zinc-900">
                  {likes.length}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main panel */}
        <div className="space-y-6">
          {tab === "overview" && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card
                title="Profile info"
                subtitle="Basic account details"
                right={
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow label="Display name" value={user.name} icon={<User className="h-4 w-4" />} />
                  <InfoRow label="Email" value={user.email} icon={<Receipt className="h-4 w-4" />} />
                  <InfoRow label="Timezone" value={user.timezone} icon={<History className="h-4 w-4" />} />
                  <InfoRow label="Locale" value={user.locale} icon={<Settings className="h-4 w-4" />} />
                </div>
              </Card>

              <Card title="Next actions" subtitle="Suggested setup steps">
                <div className="space-y-3">
                  <ActionRow
                    title="Complete your profile"
                    desc="Add avatar, bio, and contact preferences."
                    icon={<User className="h-4 w-4" />}
                  />
                  <ActionRow
                    title="Add a payment method"
                    desc="Save a card for faster checkout."
                    icon={<CreditCard className="h-4 w-4" />}
                  />
                  <ActionRow
                    title="Enable 2FA"
                    desc="Protect your account with an extra step."
                    icon={<ShieldCheck className="h-4 w-4" />}
                  />
                </div>
              </Card>

              <Card title="Recent orders" subtitle="Latest purchases and invoices" className="xl:col-span-2">
                <div className="divide-y divide-zinc-100">
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">{o.id}</span>
                          <StatusBadge status={o.status} />
                          <span className="text-xs text-zinc-500">{o.date}</span>
                        </div>
                        <div className="mt-1 text-xs text-zinc-600">
                          {o.items.map((i) => `${i.qty}× ${i.name}`).join(" • ")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <div className="text-sm font-semibold text-zinc-900">{formatMoney(o.total)}</div>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                        >
                          View <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === "todos" && (
            <Card
              title="To-dos"
              subtitle="Track tasks and setup steps"
              right={
                <div className="flex items-center gap-2">
                  <Badge tone={todoStats.remaining ? "warning" : "success"}>
                    {todoStats.remaining ? `${todoStats.remaining} remaining` : "All caught up"}
                  </Badge>
                  <button
                    type="button"
                    onClick={addTodo}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              }
            >
              <div className="space-y-2">
                {todos.map((t) => (
                  <div
                    key={t.id}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3",
                      t.done && "opacity-70"
                    )}
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTodo(t.id)}
                        className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900"
                      />
                      <span>
                        <div className={cn("text-sm font-semibold text-zinc-900", t.done && "line-through")}>
                          {t.title}
                        </div>
                        {t.due && (
                          <div className="mt-1 text-xs text-zinc-500">
                            Due: {new Date(t.due).toLocaleDateString()}
                          </div>
                        )}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setTodos((prev) => prev.filter((x) => x.id !== t.id))}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      title="Remove"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "orders" && (
            <Card title="Purchase history" subtitle="Orders, invoices, and refunds">
              <div className="space-y-3">
                {filteredOrders.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">{o.id}</span>
                          <StatusBadge status={o.status} />
                          <span className="text-xs text-zinc-500">{o.date}</span>
                        </div>
                        <div className="mt-2 text-xs text-zinc-600">
                          {o.items.map((i) => (
                            <span key={i.name} className="mr-2 inline-flex items-center">
                              <span className="mr-1 font-semibold">{i.qty}×</span> {i.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <div className="text-sm font-semibold text-zinc-900">{formatMoney(o.total)}</div>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!filteredOrders.length && (
                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
                    No orders match your search.
                  </div>
                )}
              </div>
            </Card>
          )}

          {tab === "payments" && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card
                title="Payment methods"
                subtitle="Cards, wallets, and billing defaults"
                right={
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
                    onClick={() => alert("Hook this up to your add-payment flow")}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add method
                  </button>
                }
              >
                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-inset ring-zinc-200">
                          <CreditCard className="h-5 w-5 text-zinc-700" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold text-zinc-900">
                              {pm.brand}
                              {pm.last4 ? ` •••• ${pm.last4}` : ""}
                            </span>
                            {pm.isDefault && (
                              <Badge tone="success">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {pm.expiry ? `Exp ${pm.expiry}` : "No expiry"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!pm.isDefault && (
                          <button
                            type="button"
                            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                            onClick={() => alert("Set default")}
                          >
                            Set default
                          </button>
                        )}
                        <button
                          type="button"
                          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                          onClick={() => alert("Manage")}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Billing" subtitle="Invoices, addresses, and tax details">
                <div className="space-y-3">
                  <MiniKpi
                    icon={<Receipt className="h-4 w-4" />}
                    label="Last invoice"
                    value="Dec 20, 2025"
                    note="ORD-10421"
                  />
                  <MiniKpi
                    icon={<Wallet className="h-4 w-4" />}
                    label="Current plan"
                    value={user.plan}
                    note="Renews monthly"
                  />
                  <MiniKpi
                    icon={<Package className="h-4 w-4" />}
                    label="Billing history"
                    value={`${orders.length} orders`}
                    note="View purchase history"
                    onClick={() => setTab("orders")}
                  />

                  <div className="mt-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                    <div className="text-sm font-semibold text-zinc-900">Tip</div>
                    <div className="mt-1 text-sm text-zinc-600">
                      Keep your default payment method up to date to avoid subscription interruptions.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {tab === "activity" && (
            <Card title="Activity" subtitle="Logins, updates, payments, and events">
              <div className="space-y-3">
                {filteredActivity.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-inset ring-zinc-200">
                        <span className="text-zinc-700">{a.icon}</span>
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-900">{a.title}</div>
                        {a.detail && <div className="mt-1 text-sm text-zinc-600">{a.detail}</div>}
                        <div className="mt-2 text-xs text-zinc-500">{a.time}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                    >
                      Details
                    </button>
                  </div>
                ))}

                {!filteredActivity.length && (
                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
                    No activity matches your search.
                  </div>
                )}
              </div>
            </Card>
          )}

          {tab === "likes" && (
            <Card
              title="Likes & saves"
              subtitle="Stuff you’ve bookmarked for later"
              right={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                  onClick={() => alert("Bulk manage likes")}
                >
                  <Settings className="h-3.5 w-3.5" />
                  Manage
                </button>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredLikes.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-zinc-700" />
                          <div className="truncate text-sm font-semibold text-zinc-900">
                            {l.title}
                          </div>
                        </div>
                        {l.subtitle && (
                          <div className="mt-1 text-sm text-zinc-600">{l.subtitle}</div>
                        )}
                      </div>
                      {l.tag && <Badge tone="neutral">{l.tag}</Badge>}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        Open <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        title="Remove"
                        onClick={() => alert("Remove like")}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {!filteredLikes.length && (
                  <div className="sm:col-span-2 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
                    No likes match your search.
                  </div>
                )}
              </div>
            </Card>
          )}

          {tab === "security" && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card title="Security" subtitle="Protect your account">
                <div className="space-y-3">
                  <SecurityRow
                    icon={<Lock className="h-4 w-4" />}
                    title="Password"
                    desc="Last changed 42 days ago"
                    actionLabel="Change"
                  />
                  <SecurityRow
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Two-factor authentication"
                    desc="Recommended for all accounts"
                    actionLabel="Enable"
                    badge={<Badge tone="warning">Not enabled</Badge>}
                  />
                  <SecurityRow
                    icon={<User className="h-4 w-4" />}
                    title="Active sessions"
                    desc="2 devices currently signed in"
                    actionLabel="Manage"
                  />
                </div>
              </Card>

              <Card title="Audit" subtitle="Suspicious activity and alerts">
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-900">No issues detected</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    We’ll notify you if something looks unusual.
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <MiniKpi
                    icon={<Bell className="h-4 w-4" />}
                    label="Security alerts"
                    value="Enabled"
                    note="Email + in-app"
                  />
                  <MiniKpi
                    icon={<History className="h-4 w-4" />}
                    label="Last login"
                    value="Today"
                    note="Chrome • macOS"
                  />
                </div>
              </Card>
            </div>
          )}

          {tab === "settings" && (
            <Card title="Settings" subtitle="Preferences & account controls">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <SettingToggle label="Email notifications" desc="Product updates, receipts, and security alerts" />
                  <SettingToggle label="Weekly summary" desc="A recap of activity and progress" />
                  <SettingToggle label="Public profile" desc="Allow others to find your profile" />
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">Danger zone</div>
                        <div className="mt-1 text-sm text-zinc-600">
                          Manage irreversible actions carefully.
                        </div>
                      </div>
                      <Badge tone="danger">Careful</Badge>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out everywhere
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        <XCircle className="h-4 w-4" />
                        Delete account
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                    <div className="text-sm font-semibold text-zinc-900">Integrations</div>
                    <div className="mt-1 text-sm text-zinc-600">
                      Connect external services (coming soon).
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  if (status === "Paid") {
    return (
      <Badge tone="success">
        <CheckCircle2 className="h-3.5 w-3.5" /> Paid
      </Badge>
    );
  }
  if (status === "Refunded") {
    return (
      <Badge tone="danger">
        <XCircle className="h-3.5 w-3.5" /> Refunded
      </Badge>
    );
  }
  return (
    <Badge tone="warning">
      <History className="h-3.5 w-3.5" /> Pending
    </Badge>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {icon && <span className="text-zinc-500">{icon}</span>}
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function ActionRow({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-inset ring-zinc-200">
          <span className="text-zinc-700">{icon}</span>
        </span>
        <div>
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          <div className="mt-1 text-sm text-zinc-600">{desc}</div>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
      >
        Go <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function SecurityRow({
  icon,
  title,
  desc,
  actionLabel,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  actionLabel: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-inset ring-zinc-200">
          <span className="text-zinc-700">{icon}</span>
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold text-zinc-900">{title}</div>
            {badge}
          </div>
          <div className="mt-1 text-sm text-zinc-600">{desc}</div>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
      >
        {actionLabel}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function SettingToggle({
  label,
  desc,
}: {
  label: string;
  desc: string;
}) {
  const [on, setOn] = useState(true);
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">{label}</div>
          <div className="mt-1 text-sm text-zinc-600">{desc}</div>
        </div>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className={cn(
            "relative h-7 w-12 rounded-full p-1 transition",
            on ? "bg-zinc-900" : "bg-zinc-200"
          )}
          aria-pressed={on}
          aria-label={label}
        >
          <span
            className={cn(
              "block h-5 w-5 rounded-full bg-white shadow-sm transition",
              on ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
      <div className="mt-3">
        {on ? (
          <Badge tone="success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
          </Badge>
        ) : (
          <Badge tone="neutral">
            <XCircle className="h-3.5 w-3.5" /> Disabled
          </Badge>
        )}
      </div>
    </div>
  );
}
