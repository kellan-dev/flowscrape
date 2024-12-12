import { getAvailableCredits } from "@/actions/billing/get-available-credits";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/react-count-up-wrapper";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import CreditsPurchase from "./_components/credits-purchase";
import { Period } from "@/types/analytics";
import { getCreditsUsageInPeriod } from "@/actions/analytics/get-credits-usage-in-period";
import CreditUsageChart from "./_components/credit-usage-chart";
import { getUserPurchaseHistory } from "@/actions/billing/get-user-purchase-history";
import InvoiceBtn from "./_components/invoice-btn";

export default async function BillingPage() {
  return (
    <div className="mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}

async function BalanceCard() {
  const userBalance = await getAvailableCredits();
  return (
    <Card className="flex flex-col justify-between overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
      <CardContent className="relative items-center p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Available Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountUpWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="absolute bottom-0 right-0 text-primary opacity-20"
          />
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        When your credit balance reaches zero, your workflows will stop working
      </CardFooter>
    </Card>
  );
}

async function CreditUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  const data = await getCreditsUsageInPeriod(period);

  return (
    <CreditUsageChart
      data={data}
      title="Credits spent"
      description="Daily credits consumed in the current period"
    />
  );
}

async function TransactionHistoryCard() {
  const purchases = await getUserPurchaseHistory();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ArrowLeftRightIcon className="size-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No transactions found</p>
        )}
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatAmount(purchase.amount, purchase.currency)}
              </p>
              <InvoiceBtn id={purchase.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}
