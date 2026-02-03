import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { ParameterSlider } from "@/components/parameter-slider";
import { ResultCard } from "@/components/result-card";
import { ScenarioComparisonChart } from "@/components/scenario-comparison-chart";
import { InfoModal, PARAMETER_EXPLANATIONS } from "@/components/info-modal";
import { calculateUBI, PRESET_SCENARIOS, type UBIParameters } from "@/lib/ubi-calculator";

const STORAGE_KEY = "@ubi_parameters";

export default function HomeScreen() {
  const [parameters, setParameters] = useState<UBIParameters>(PRESET_SCENARIOS.current.params);
  const [selectedScenario, setSelectedScenario] = useState<string>("current");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const showInfo = (key: string) => {
    const info = PARAMETER_EXPLANATIONS[key];
    if (info) {
      setModalContent(info);
      setModalVisible(true);
    }
  };

  // パラメーターをAsyncStorageから読み込み
  useEffect(() => {
    loadParameters();
  }, []);

  // パラメーターが変更されたら保存
  useEffect(() => {
    saveParameters();
  }, [parameters]);

  const loadParameters = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setParameters(JSON.parse(stored));
        setSelectedScenario("custom");
      }
    } catch (error) {
      console.error("Failed to load parameters:", error);
    }
  };

  const saveParameters = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parameters));
    } catch (error) {
      console.error("Failed to save parameters:", error);
    }
  };

  const updateParameter = (key: keyof UBIParameters, value: number) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
    setSelectedScenario("custom");
  };

  const loadScenario = (scenarioKey: string) => {
    setParameters(PRESET_SCENARIOS[scenarioKey].params);
    setSelectedScenario(scenarioKey);
  };

  const result = calculateUBI(parameters);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="p-6 gap-6">
          {/* ヘッダー */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">UBI実現可能性</Text>
            <Text className="text-base text-muted">
              パラメーターを調整して、AI時代のUBI給付可能額をシミュレーション
            </Text>
          </View>

          {/* 結果表示 */}
          <ResultCard result={result} />

          {/* シナリオ比較グラフ */}
          <ScenarioComparisonChart />

          {/* プリセットシナリオ */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">シナリオ選択</Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.entries(PRESET_SCENARIOS).map(([key, scenario]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => loadScenario(key)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedScenario === key
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                  style={{ opacity: selectedScenario === key ? 1 : 0.7 }}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedScenario === key ? "text-background" : "text-foreground"
                    }`}
                  >
                    {scenario.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* パラメーター調整 */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">パラメーター調整</Text>

            <ParameterSlider
              label="AI労働代替率"
              value={parameters.alpha}
              onValueChange={(value) => updateParameter("alpha", value)}
              min={0}
              max={1}
              step={0.01}
              unit="%"
              multiplier={100}
              description="AIが人間の仕事を代替する比率"
              onInfoPress={() => showInfo("alpha")}
            />

            <ParameterSlider
              label="資本収益集中度"
              value={parameters.beta}
              onValueChange={(value) => updateParameter("beta", value)}
              min={0}
              max={1}
              step={0.01}
              unit="%"
              multiplier={100}
              description="生産性向上の果実が資本に集中する度合い"
              onInfoPress={() => showInfo("beta")}
            />

            <ParameterSlider
              label="生産性向上率"
              value={parameters.gamma}
              onValueChange={(value) => updateParameter("gamma", value)}
              min={1.0}
              max={2.0}
              step={0.1}
              unit="倍"
              multiplier={1}
              description="AIによる生産性の向上倍率"
              onInfoPress={() => showInfo("gamma")}
            />

            <ParameterSlider
              label="1人あたりGDP倍率"
              value={parameters.gdpPerCapitaMultiplier}
              onValueChange={(value) => updateParameter("gdpPerCapitaMultiplier", value)}
              min={0.5}
              max={3.0}
              step={0.1}
              unit="倍"
              multiplier={1}
              description="現在の日本の1人あたりGDPに対する倍率"
              onInfoPress={() => showInfo("gdpPerCapitaMultiplier")}
            />

            <ParameterSlider
              label="社会維持コスト（GDP比）"
              value={parameters.socialCostRatio}
              onValueChange={(value) => updateParameter("socialCostRatio", value)}
              min={0.1}
              max={0.5}
              step={0.01}
              unit="%"
              multiplier={100}
              description="医療・年金・防衛費などUBI以外の政府支出"
              onInfoPress={() => showInfo("socialCostRatio")}
            />

            <ParameterSlider
              label="固定コスト率（GDP比）"
              value={parameters.fixedCostRatio}
              onValueChange={(value) => updateParameter("fixedCostRatio", value)}
              min={0.05}
              max={0.3}
              step={0.01}
              unit="%"
              multiplier={100}
              description="UBIで削減不可能な政府支出（国債費・防衛費・公共事業など）"
              onInfoPress={() => showInfo("fixedCostRatio")}
            />

            <ParameterSlider
              label="社会保障削減率"
              value={parameters.socialSecurityReductionRate}
              onValueChange={(value) => updateParameter("socialSecurityReductionRate", value)}
              min={0}
              max={1}
              step={0.05}
              unit="%"
              multiplier={100}
              description="UBI給付により削減可能な社会保障費の割合（年金・生活保護など）"
              onInfoPress={() => showInfo("socialSecurityReductionRate")}
            />

            <ParameterSlider
              label="社会保険料維持率"
              value={parameters.socialInsuranceRatio}
              onValueChange={(value) => updateParameter("socialInsuranceRatio", value)}
              min={0}
              max={1}
              step={0.1}
              unit="%"
              multiplier={100}
              description="0%=完全税収化、50%=半分を税収化、100%=現状維持"
              onInfoPress={() => showInfo("socialInsuranceRatio")}
            />

            <View className="pt-2">
              <Text className="text-base font-semibold text-foreground mb-3">税率設定</Text>

              <ParameterSlider
                label="個人所得税率"
                value={parameters.taxPersonal}
                onValueChange={(value) => updateParameter("taxPersonal", value)}
                min={0}
                max={0.5}
                step={0.01}
                unit="%"
                multiplier={100}
                onInfoPress={() => showInfo("taxPersonal")}
              />

              <ParameterSlider
                label="法人税率"
                value={parameters.taxCorporate}
                onValueChange={(value) => updateParameter("taxCorporate", value)}
                min={0}
                max={1}
                step={0.01}
                unit="%"
                multiplier={100}
                onInfoPress={() => showInfo("taxCorporate")}
              />

              <ParameterSlider
                label="消費税率"
                value={parameters.taxConsumption}
                onValueChange={(value) => updateParameter("taxConsumption", value)}
                min={0}
                max={0.3}
                step={0.01}
                unit="%"
                multiplier={100}
                onInfoPress={() => showInfo("taxConsumption")}
              />

              <ParameterSlider
                label="固定資産税率"
                value={parameters.taxProperty}
                onValueChange={(value) => updateParameter("taxProperty", value)}
                min={0}
                max={0.05}
                step={0.001}
                unit="%"
                multiplier={100}
                onInfoPress={() => showInfo("taxProperty")}
              />

              <ParameterSlider
                label="税収調整係数"
                value={parameters.taxAdjustmentFactor}
                onValueChange={(value) => updateParameter("taxAdjustmentFactor", value)}
                min={0.5}
                max={1.5}
                step={0.01}
                unit="倍"
                multiplier={1}
                description="モデルと実際の税収のギャップを調整（捕捉率・軽減税率など）"
                onInfoPress={() => showInfo("taxAdjustmentFactor")}
              />

              <ParameterSlider
                label="財政赤字率（GDP比）"
                value={parameters.fiscalDeficitRatio}
                onValueChange={(value) => updateParameter("fiscalDeficitRatio", value)}
                min={0}
                max={0.1}
                step={0.005}
                unit="%"
                multiplier={100}
                description="国債発行による財政赤字の規模（0%=均衡財政、2025年度現状約3.6%）"
                onInfoPress={() => showInfo("fiscalDeficitRatio")}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </ScreenContainer>
  );
}
