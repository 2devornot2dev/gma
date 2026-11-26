import Link from "next/link"

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Distributor Portal
          </h1>
          <p className="text-muted-foreground text-sm">
            Account Tier: <span className="font-medium text-foreground">Distributor</span> · Terms: <span className="font-medium text-foreground">Net 30</span>
          </p>
        </div>

        <Link
          href="/client/catalog"
          className="bg-knicks hover:bg-knicks-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          New Order
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-5">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Open Orders
          </p>
          <p className="mt-2 text-2xl font-bold">3</p>
        </div>
        <div className="bg-card rounded-lg border p-5">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            In Transit
          </p>
          <p className="mt-2 text-2xl font-bold">1</p>
        </div>
        <div className="bg-card rounded-lg border p-5">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Balance Due
          </p>
          <p className="mt-2 text-2xl font-bold">$4,280.00</p>
        </div>
        <div className="bg-card rounded-lg border p-5">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Available Credit
          </p>
          <p className="mt-2 text-2xl font-bold">$15,720.00</p>
        </div>
      </div>

      {/* Recent Orders / Quick Reorder */}
      <div className="bg-card rounded-lg border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Orders</h2>
          <Link
            href="/client/orders"
            className="text-navy text-sm font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        <p className="text-muted-foreground text-sm">
          Connect your orders query here to show recent shipments, tracking
          numbers, and a 1-click Reorder action.
        </p>
      </div>
    </div>
  )
}