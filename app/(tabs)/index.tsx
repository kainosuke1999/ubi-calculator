import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/screen-container";
import { ParameterSlider } from "@/components/parameter-slider";
import { ResultCard } from "@/components/result-card";
import { ScenarioComparisonChart } from "@/components/scenario-comparison-chart";
import { InfoModal, PARAMETER_EXPLANATIONS } from "@/components/info-modal";
import { LanguageSwitcher } from "@/components/language-switcher";
import { calculateUBI, PRESET_SCENARIOS, type UBIParameters } from "@/lib/ubi-calculator";

const STORAGE_KEY = "@ubi_parameters";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [parameters, setParameters] = useState<UBIParameters>(PRESET_SCENARIOS.current.params);
  const [selectedScenario, setSelectedScenario] = useState<string>("current");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const showInfo = (key: string) => {
    const title = t(`parameterInfo.${key}.title`);
    const content = t(`parameterInfo.${key}.content`);
    setModalContent({ title, content });
    setModalVisible(true);
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

  // Get translated scenario names
  const getScenarioName = (key: string) => {
    return t(`scenarios.${key}`);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="p-6 gap-6">
          {/* ヘッダー */}
          <View className="gap-3">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground">{t("app.title")}</Text>
                <Text className="text-base text-muted mt-2">{t("app.subtitle")}</Text>
              </View>
            </View>
            <LanguageSwitcher />
          </View>

          {/* 結果表示 */}
          <ResultCard result={result} />

          {/* シナリオ比較グラフ */}
          <ScenarioComparisonChart />

          {/* プリセットシナリオ */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">{t("simulator.selectScenario")}</Text>
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
                    {getScenarioName(key)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* パラメーター調整 */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">{t("simulator.parameters")}</Text>

            <ParameterSlider
              label={t("parameters.alpha")}
              value={parameters.alpha}
              onValueChange={(value) => updateParameter("alpha", value)}
              min={0}
              max={1}
              step={0.01}
              unit="%"
              multiplier={100}
              description={t("parameters.alphaDesc")}
              onInfoPress={() => showInfo("alpha")}
            />

            <ParameterSlider
              label={t("parameters.beta")}
              value={parameters.beta}
              onValueChange={(value) => updateParameter("beta", value)}
              min={0}
              max={1}
              step={0.01}
              unit="%"
              multiplier={100}
              description={t("parameters.betaDesc")}
              onInfoPress={() => showInfo("beta")}
            />

            <ParameterSlider
              label={t("parameters.gamma")}
              value={parameters.gamma}
              onValueChange={(value) => updateParameter("gamma", value)}
              min={1.0}
              max={2.0}
              step={0.1}
              unit="倍"
              multiplier={1}
              description={t("parameters.gammaDesc")}
              onInfoPress={() => showInfo("gamma")}
            />

            <ParameterSlider
              label={t("parameters.gdpPerCapitaMultiplier")}
              value={parameters.gdpPerCapitaMultiplier}
              onValueChange={(value) => updateParameter("gdpPerCapitaMultiplier", value)}
              min={0.5}
              max={3.0}
              step={0.1}
              unit="倍"
              multiplier={1}
              description={t("parameters.gdpPerCapitaMultiplierDesc")}
              onInfoPress={() => showInfo("gdpPerCapitaMultiplier")}
            />

            <ParameterSlider
              label={t("parameters.socialCostRatio")}
              value={parameters.socialCostRatio}
              onValueChange={(value) => updateParameter("socialCostRatio", value)}
              min={0.1}
              max={0.5}
              step={0.01}
              unit="%"
              multiplier={100}
              description={t("parameters.socialCostRatioDesc")}
              onInfoPress={() => showInfo("socialCostRatio")}
            />

            <ParameterSlider
              label={t("parameters.fixedCostRatio")}
              value={parameters.fixedCostRatio}
              onValueChange={(value) => updateParameter("fixedCostRatio", value)}
              min={0.05}
              max={0.3}
              step={0.01}
              unit="%"
              multiplier={100}
              description={t("parameters.fixedCostRatioDesc")}
              onInfoPress={() => showInfo("fixedCostRatio")}
            />

            <ParameterSlider
              label={t("parameters.socialSecurityReductionRate")}
              value={parameters.socialSecurityReductionRate}
              onValueChange={(value) => updateParameter("socialSecurityReductionRate", value)}
              min={0}
              max={1}
              step={0.05}
              unit="%"
              multiplier={100}
              description={t("parameters.socialSecurityReductionRateDesc")}
              onInfoPress={() => showInfo("socialSecurityReductionRate")}
            />

            <ParameterSlider
              label={t("parameters.socialInsuranceMaintenance")}
              value={parameters.socialInsuranceRatio}
              onValueChange={(value) => updateParameter("socialInsuranceRatio", value)}
              min={0}
              max={1}
              step={0.1}
              unit="%"
              multiplier={100}
              description={t("parameters.socialInsuranceMaintenanceDesc")}
              onInfoPress={() => showInfo("socialInsuranceRatio")}
            />

            <View className="pt-2">
              <Text className="text-base font-semibold text-foreground mb-3">{t("parameters.taxSection")}</Text>

              <ParameterSlider
                label={t("parameters.incomeTaxRate")}
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
                label={t("parameters.corporateTaxRate")}
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
                label={t("parameters.consumptionTaxRate")}
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
                label={t("parameters.propertyTaxRate")}
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
                label={t("parameters.taxAdjustmentFactor")}
                value={parameters.taxAdjustmentFactor}
                onValueChange={(value) => updateParameter("taxAdjustmentFactor", value)}
                min={0.5}
                max={1.5}
                step={0.01}
                unit="倍"
                multiplier={1}
                description={t("parameters.taxAdjustmentFactorDesc")}
                onInfoPress={() => showInfo("taxAdjustmentFactor")}
              />

              <ParameterSlider
                label={t("parameters.fiscalDeficitRatio")}
                value={parameters.fiscalDeficitRatio}
                onValueChange={(value) => updateParameter("fiscalDeficitRatio", value)}
                min={0}
                max={0.1}
                step={0.005}
                unit="%"
                multiplier={100}
                description={t("parameters.fiscalDeficitRatioDesc")}
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
