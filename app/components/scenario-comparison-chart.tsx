import { View, Text } from "react-native";
import { calculateUBI, PRESET_SCENARIOS } from "@/lib/ubi-calculator";
import { useColors } from "@/hooks/use-colors";

export function ScenarioComparisonChart() {
  const colors = useColors();

  // 各シナリオの月額UBI給付額を計算
  const scenarios = Object.entries(PRESET_SCENARIOS).map(([key, scenario]) => {
    const result = calculateUBI(scenario.params);
    return {
      key,
      name: scenario.name,
      monthlyUBI: result.monthlyUBI,
    };
  });

  // 最大値を取得してスケーリング
  const maxUBI = Math.max(...scenarios.map((s) => s.monthlyUBI));
  const scale = maxUBI > 0 ? 1 / maxUBI : 1;

  return (
    <View className="gap-4">
      <Text className="text-lg font-semibold text-foreground">シナリオ比較</Text>
      <View className="bg-surface rounded-2xl p-4 gap-4">
        {scenarios.map((scenario) => {
          const widthPercent = scenario.monthlyUBI * scale * 100;
          const isZero = scenario.monthlyUBI === 0;

          return (
            <View key={scenario.key} className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-medium text-foreground flex-1">
                  {scenario.name}
                </Text>
                <Text
                  className={`text-sm font-bold ${
                    isZero ? "text-error" : "text-primary"
                  }`}
                >
                  {isZero
                    ? "¥0"
                    : `¥${scenario.monthlyUBI.toLocaleString()}`}
                </Text>
              </View>
              <View className="h-8 bg-border rounded-lg overflow-hidden">
                {!isZero && (
                  <View
                    className="h-full bg-primary"
                    style={{ width: `${Math.max(widthPercent, 5)}%` }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
      <Text className="text-xs text-muted px-2">
        ※ 各シナリオのパラメーター設定に基づく月額UBI給付可能額の比較
      </Text>
    </View>
  );
}
