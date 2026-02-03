import { View, Text } from "react-native";
import type { UBIResult } from "@/lib/ubi-calculator";

interface ResultCardProps {
  result: UBIResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value)) {
      return "0";
    }
    return value.toLocaleString("ja-JP");
  };

  const formatNumber = (value: number, decimals: number = 1) => {
    if (isNaN(value) || !isFinite(value)) {
      return "0.0";
    }
    return value.toFixed(decimals);
  };

  const isPositive = result.monthlyUBI > 0;

  return (
    <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border gap-4">
      {/* メイン結果 */}
      <View className="items-center gap-2">
        <Text className="text-sm font-medium text-muted">月額UBI給付可能額（名目）</Text>
        <Text
          className={`text-5xl font-bold ${isPositive ? "text-success" : "text-error"}`}
        >
          {isPositive ? "¥" : "¥0"}
          {isPositive && formatCurrency(result.monthlyUBI)}
        </Text>
        {isPositive && (
          <Text className="text-sm text-muted">
            年額 ¥{formatCurrency(result.annualUBI)}
          </Text>
        )}
        {isPositive && result.inflationRate > 0 && (
          <View className="items-center gap-1 mt-2">
            <Text className="text-xs text-warning">
              インフレ率: {formatNumber(result.inflationRate)}%
            </Text>
            <Text className="text-sm font-semibold text-success">
              実質購買力: ¥{formatCurrency(result.realMonthlyUBI)}/月
            </Text>
            <Text className="text-xs text-muted">
              (年額 ¥{formatCurrency(result.realAnnualUBI)})
            </Text>
          </View>
        )}
        {!isPositive && (
          <Text className="text-sm text-error text-center">
            現在の設定では、社会維持コストを賔うことができず、UBIの給付は不可能です
          </Text>
        )}
      </View>

      {/* 詳細情報 */}
      <View className="pt-4 border-t border-border gap-3">
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">生産性係数 (γ)</Text>
          <Text className="text-sm font-semibold text-foreground">
            {formatNumber(result.productivityCoefficient, 3)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">調整後GDP</Text>
          <Text className="text-sm font-semibold text-foreground">
            {formatNumber(result.adjustedGDP)}兆円
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">調整後税収</Text>
          <Text className="text-sm font-semibold text-foreground">
            {formatNumber(result.adjustedTaxRevenue)}兆円
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">財政赤字（国債発行）</Text>
          <Text className={`text-sm font-semibold ${
            result.fiscalDeficit > 0 ? "text-warning" : "text-foreground"
          }`}>
            {formatNumber(result.fiscalDeficit)}兆円
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">総収入（税収+赤字）</Text>
          <Text className="text-sm font-semibold text-foreground">
            {formatNumber(result.totalRevenue)}兆円
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">純財政余剰</Text>
          <Text
            className={`text-sm font-semibold ${
              result.netSurplus > 0 ? "text-success" : "text-error"
            }`}
          >
            {formatNumber(result.netSurplus)}兆円
          </Text>
        </View>

        {isPositive && (
          <>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">UBI給付総額</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formatNumber(result.totalUBIPayment)}兆円
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">社会保障削減額</Text>
              <Text className="text-sm font-semibold text-success">
                {formatNumber(result.socialSecurityReduction)}兆円
              </Text>
            </View>
          </>
        )}

        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">総税収（GDP比）</Text>
          <Text className="text-sm font-semibold text-foreground">
            {formatNumber(result.gdpRatios.totalRevenue)}%
          </Text>
        </View>
      </View>

      {/* 税収内訳 */}
      <View className="pt-4 border-t border-border gap-2">
        <Text className="text-sm font-semibold text-foreground mb-1">税収内訳</Text>

        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">個人所得税</Text>
          <Text className="text-xs font-medium text-foreground">
            {formatNumber(result.revenueBreakdown.personal)}兆円
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">法人税</Text>
          <Text className="text-xs font-medium text-foreground">
            {formatNumber(result.revenueBreakdown.corporate)}兆円
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">消費税</Text>
          <Text className="text-xs font-medium text-foreground">
            {formatNumber(result.revenueBreakdown.consumption)}兆円
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">固定資産税</Text>
          <Text className="text-xs font-medium text-foreground">
            {formatNumber(result.revenueBreakdown.property)}兆円
          </Text>
        </View>
      </View>
    </View>
  );
}
