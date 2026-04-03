import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const MONTHLY_MULTIPLIER: Record<string, number> = {
  daily: 30,
  weekly: 4.345,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
  annual: 1 / 12,
};

const getMonthlyEquivalent = (subscription: Subscription) => {
  const billingKey = subscription.billing.toLowerCase();
  const multiplier = MONTHLY_MULTIPLIER[billingKey] ?? 1;
  return subscription.price * multiplier;
};

const Insights = () => {
  const { subscriptions } = useSubscriptionStore();

  const billableSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) => subscription.status !== "cancelled",
      ),
    [subscriptions],
  );

  const estimatedMonthlySpend = useMemo(
    () =>
      billableSubscriptions.reduce(
        (total, subscription) => total + getMonthlyEquivalent(subscription),
        0,
      ),
    [billableSubscriptions],
  );

  const activeSubscriptions = useMemo(
    () =>
      billableSubscriptions.filter(
        (subscription) => subscription.status === "active",
      ),
    [billableSubscriptions],
  );

  const nextRenewal = useMemo(() => {
    const now = dayjs();

    return activeSubscriptions
      .filter(
        (subscription) =>
          subscription.renewalDate &&
          dayjs(subscription.renewalDate).isAfter(now),
      )
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)))[0];
  }, [activeSubscriptions]);

  const topCategory = useMemo(() => {
    const categoryTotals = billableSubscriptions.reduce<Record<string, number>>(
      (acc, subscription) => {
        const key = subscription.category || "Other";
        const currentTotal = acc[key] ?? 0;
        return {
          ...acc,
          [key]: currentTotal + getMonthlyEquivalent(subscription),
        };
      },
      {},
    );

    return Object.entries(categoryTotals).sort(
      ([, totalA], [, totalB]) => totalB - totalA,
    )[0];
  }, [billableSubscriptions]);

  const insightStats = [
    {
      id: "monthly-spend",
      label: "Estimated Monthly Spend",
      value: formatCurrency(estimatedMonthlySpend),
      hint: `${billableSubscriptions.length} tracked subscriptions`,
    },
    {
      id: "next-renewal",
      label: "Next Renewal",
      value: nextRenewal ? nextRenewal.name : "No upcoming renewal",
      hint: nextRenewal?.renewalDate
        ? dayjs(nextRenewal.renewalDate).format("MMM D, YYYY")
        : "Add a renewal date to track",
    },
    {
      id: "top-category",
      label: "Top Category",
      value: topCategory ? topCategory[0] : "No category data",
      hint: topCategory
        ? formatCurrency(topCategory[1])
        : "Categorize subscriptions for trends",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={insightStats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 120,
          gap: 12,
        }}
        ListHeaderComponent={
          <View className="mb-2">
            <Text className="text-3xl font-sans-bold text-primary">
              Insights
            </Text>
            <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
              Track where your subscription budget is going.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-3xl border border-border bg-card p-5">
            <Text className="text-xs font-sans-semibold uppercase tracking-[0.8px] text-muted-foreground">
              {item.label}
            </Text>
            <Text className="mt-2 text-2xl font-sans-bold text-primary">
              {item.value}
            </Text>
            <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
              {item.hint}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View className="mt-4 rounded-3xl border border-border bg-background p-5">
            <Text className="text-base font-sans-semibold text-primary">
              What is next
            </Text>
            <Text className="mt-2 text-sm font-sans-medium leading-6 text-muted-foreground">
              This base Insights screen is ready for trends, charts, and
              forecasts.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
export default Insights;
