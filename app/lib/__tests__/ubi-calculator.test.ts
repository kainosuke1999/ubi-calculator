import { describe, it, expect } from "vitest";
import { calculateUBI, PRESET_SCENARIOS } from "../ubi-calculator";

describe("UBI Calculator", () => {
  describe("calculateUBI", () => {
    it("現状シナリオで正しく計算される", () => {
      const result = calculateUBI(PRESET_SCENARIOS.current.params);
      // 現状（2025年）では財政赤字を含めても余剰がマイナスでUBI給付不可
      expect(result.monthlyUBI).toBe(0);
      expect(result.netSurplus).toBeLessThan(0); // 赤字
      // 財政赤字が含まれていることを確認
      expect(result.fiscalDeficit).toBeGreaterThan(0);
      expect(result.adjustedTaxRevenue).toBeGreaterThan(0);
      expect(result.totalRevenue).toBeCloseTo(result.adjustedTaxRevenue + result.fiscalDeficit, 1);
    });

    it("提案ケースで正の月額UBIが算出される", () => {
      const result = calculateUBI(PRESET_SCENARIOS.proposed.params);

      // 提案ケースでは月額70万円以上のUBIが可能（税率感応度を考慮）
      expect(result.monthlyUBI).toBeGreaterThan(700000);
      expect(result.annualUBI).toBeGreaterThan(8000000);
      expect(result.netSurplus).toBeGreaterThan(0);
      // インフレ率と実質購買力が計算されていることを確認
      expect(result.inflationRate).toBeGreaterThan(0);
      expect(result.realMonthlyUBI).toBeGreaterThan(0);
      expect(result.realMonthlyUBI).toBeLessThan(result.monthlyUBI);
    });

    it("AI代替率が高いほど法人税収が増加する", () => {
      const lowAI = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        alpha: 0.2,
      });

      const highAI = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        alpha: 0.8,
      });

      expect(highAI.revenueBreakdown.corporate).toBeGreaterThan(
        lowAI.revenueBreakdown.corporate
      );
    });

    it("AI代替率が高いほど個人所得税収が減少する", () => {
      const lowAI = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        alpha: 0.2,
      });

      const highAI = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        alpha: 0.8,
      });

      expect(highAI.revenueBreakdown.personal).toBeLessThan(
        lowAI.revenueBreakdown.personal
      );
    });

    it("生産性向上率が高いほど総税収が増加する", () => {
      const lowGamma = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        gamma: 1.0,
      });

      const highGamma = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        gamma: 2.0,
      });

      expect(highGamma.totalRevenue).toBeGreaterThan(lowGamma.totalRevenue);
    });

    it("税率が高いほど税収が増加する", () => {
      const lowTax = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        taxCorporate: 0.3,
      });

      const highTax = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        taxCorporate: 0.8,
      });

      expect(highTax.revenueBreakdown.corporate).toBeGreaterThan(
        lowTax.revenueBreakdown.corporate
      );
      expect(highTax.totalRevenue).toBeGreaterThan(lowTax.totalRevenue);
    });

    it("税収内訳の合計が調整後税収と一致する", () => {
      const result = calculateUBI(PRESET_SCENARIOS.moderate.params);

      const sum =
        result.revenueBreakdown.personal +
        result.revenueBreakdown.corporate +
        result.revenueBreakdown.consumption +
        result.revenueBreakdown.property;

      // 税収内訳の合計は調整後税収と一致（財政赤字は含まない）
      expect(Math.abs(sum - result.adjustedTaxRevenue)).toBeLessThan(0.2);
      // 総収入 = 調整後税収 + 財政赤字
      expect(Math.abs(result.totalRevenue - (result.adjustedTaxRevenue + result.fiscalDeficit))).toBeLessThan(0.1);
    });

    it("月額UBIが年額UBIの1/12である", () => {
      const result = calculateUBI(PRESET_SCENARIOS.proposed.params);

      // 丸め誤差を考慮して許容範囲を広げる
      expect(Math.abs(result.monthlyUBI * 12 - result.annualUBI)).toBeLessThan(10);
    });

    it("財政赤字率が高いほど総収入が増加する", () => {
      const noDeficit = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        fiscalDeficitRatio: 0.0,
      });

      const withDeficit = calculateUBI({
        ...PRESET_SCENARIOS.moderate.params,
        fiscalDeficitRatio: 0.05,
      });

      expect(withDeficit.fiscalDeficit).toBeGreaterThan(noDeficit.fiscalDeficit);
      expect(withDeficit.totalRevenue).toBeGreaterThan(noDeficit.totalRevenue);
      expect(withDeficit.monthlyUBI).toBeGreaterThan(noDeficit.monthlyUBI);
    });

    it("財政赤字率が0の場合、財政赤字が0である", () => {
      const result = calculateUBI({
        ...PRESET_SCENARIOS.advanced.params,
        fiscalDeficitRatio: 0.0,
      });

      expect(result.fiscalDeficit).toBe(0);
      expect(result.totalRevenue).toBeCloseTo(result.adjustedTaxRevenue, 1);
    });
  });

  describe("PRESET_SCENARIOS", () => {
    it("すべてのプリセットシナリオが有効なパラメーターを持つ", () => {
      Object.entries(PRESET_SCENARIOS).forEach(([key, scenario]) => {
        expect(scenario.name).toBeTruthy();
        expect(scenario.params.alpha).toBeGreaterThanOrEqual(0);
        expect(scenario.params.alpha).toBeLessThanOrEqual(1);
        expect(scenario.params.beta).toBeGreaterThanOrEqual(0);
        expect(scenario.params.beta).toBeLessThanOrEqual(1);
        expect(scenario.params.gamma).toBeGreaterThanOrEqual(1);
        expect(scenario.params.gamma).toBeLessThanOrEqual(2);
      });
    });

    it("AI代替率が現状<中程度<高度<提案の順に増加する", () => {
      expect(PRESET_SCENARIOS.current.params.alpha).toBeLessThan(
        PRESET_SCENARIOS.moderate.params.alpha
      );
      expect(PRESET_SCENARIOS.moderate.params.alpha).toBeLessThan(
        PRESET_SCENARIOS.advanced.params.alpha
      );
      expect(PRESET_SCENARIOS.advanced.params.alpha).toBeLessThan(
        PRESET_SCENARIOS.proposed.params.alpha
      );
    });
  });
});
