/**
 * UBI実現可能性計算モデル
 * 
 * このモジュールは、AI時代におけるユニバーサルベーシックインカム（UBI）の
 * 実現可能性を定量的に評価するための計算ロジックを提供します。
 */

export interface UBIParameters {
  /** AI労働代替率 (0-1) */
  alpha: number;
  /** 資本収益集中度 (0-1) */
  beta: number;
  /** 生産性向上率 (1.0-2.0) */
  gamma: number;
  /** 個人所得税率 (0-1) */
  taxPersonal: number;
  /** 法人税率 (0-1) */
  taxCorporate: number;
  /** 消費税率 (0-1) */
  taxConsumption: number;
  /** 固定資産税率 (0-1) */
  taxProperty: number;
  /** 社会維持コスト（GDP比, 0-1) */
  socialCostRatio: number;
  /** 1人あたりGDP倍率 (0.5-3.0) */
  gdpPerCapitaMultiplier: number;
  /** 社会保険料維持率 (0-1): 0=完全税収化、1=現状維持 */
  socialInsuranceRatio: number;
  /** 税収調整係数 (0.5-1.5): モデルと実際の税収のギャップを調整 */
  taxAdjustmentFactor: number;
  /** 財政赤字率 (0-0.1): GDP比での国債発行率、0=均衡財政 */
  fiscalDeficitRatio: number;
  /** 固定コスト率 (0-0.5): UBIで削減不可能な政府支出（GDP比）*/
  fixedCostRatio: number;
  /** 社会保障削減率 (0-1): UBI給付により削減可能な社会保障費の割合 */
  socialSecurityReductionRate: number;
  /** インフレ感応度 (0-1): UBI給付総額がGDPに占める割合に対するインフレ率の上昇率 */
  inflationSensitivity: number;
  /** 税率感応度 (0-1): 法人税率が生産性に与える影響 */
  taxSensitivity: number;
}

export interface UBIResult {
  /** 月額UBI給付可能額（円） */
  monthlyUBI: number;
  /** 年額UBI給付可能額（円） */
  annualUBI: number;
  /** 総税収（兆円） */
  totalRevenue: number;
  /** 純財政余剰（兆円） */
  netSurplus: number;
  /** 調整後税収（兆円） */
  adjustedTaxRevenue: number;
  /** 財政赤字（国債発行、兆円） */
  fiscalDeficit: number;
  /** 税収内訳 */
  revenueBreakdown: {
    personal: number;
    corporate: number;
    consumption: number;
    property: number;
  };
  /** GDP比率 */
  gdpRatios: {
    totalRevenue: number;
    netSurplus: number;
  };
  /** インフレ率 (0-1) */
  inflationRate: number;
  /** 実質購買力：月額UBI（円） */
  realMonthlyUBI: number;
  /** 実質購買力：年額UBI（円） */
  realAnnualUBI: number;
  /** 生産性係数 */
  productivityCoefficient: number;
  /** 調整後GDP（兆円） */
  adjustedGDP: number;
  /** 社会保障削減額（兆円） */
  socialSecurityReduction: number;
  /** UBI給付総額（兆円） */
  totalUBIPayment: number;
}

// 日本の基礎データ（2025年想定）
const BASE_DATA = {
  baseGdp: 600, // 基準GDP（兆円）
  population: 125_000_000, // 人
  socialInsuranceAmount: 82.2, // 現状の社会保険料（兆円）
};

/**
 * UBI実現可能性を計算
 */
export function calculateUBI(params: UBIParameters): UBIResult {
  const { alpha, beta, gamma, taxPersonal, taxCorporate, taxConsumption, taxProperty, socialCostRatio, gdpPerCapitaMultiplier, socialInsuranceRatio, taxAdjustmentFactor, fiscalDeficitRatio, fixedCostRatio, socialSecurityReductionRate, inflationSensitivity, taxSensitivity } = params;
  
  // 1. 1人あたりGDP倍率を考慮した基準GDP
  const adjustedBaseGdp = BASE_DATA.baseGdp * gdpPerCapitaMultiplier;
  
  // 2. 生産性係数の内生化：法人税率が生産性に与える影響を考慮
  // γ = γ0 × (1 - λ · t_corporate)
  const productivityCoefficient = gamma * (1 - taxSensitivity * taxCorporate);
  
  // 3. 生産性向上後GDP
  const gdpEnhanced = adjustedBaseGdp * productivityCoefficient;
  
  // 2. 労働所得と資本所得の分配
  const laborShare = 1 - alpha; // 人間が働く比率
  const capitalShare = alpha; // AIが働く比率
  
  // 3. 各税収の計算
  // 個人所得税：人間の労働所得 × (1-β) × 税率
  const personalIncome = gdpEnhanced * laborShare * (1 - beta);
  const revenuePersonal = personalIncome * taxPersonal;
  
  // 法人税：資本所得 + 労働所得のβ部分
  const corporateIncome = gdpEnhanced * (capitalShare + laborShare * beta);
  const revenueCorporate = corporateIncome * taxCorporate;
  
  // 消費税：GDP × 消費性向(0.6) × 税率
  const revenueConsumption = gdpEnhanced * 0.6 * taxConsumption;
  
  // 固定資産税：GDP × 資産比率(2.0) × 税率
  const revenueProperty = gdpEnhanced * 2.0 * taxProperty;
  
  // 4. 理論的な総税収
  const theoreticalRevenue = revenuePersonal + revenueCorporate + revenueConsumption + revenueProperty;
  
  // 5. 税収調整係数を適用
  const adjustedTaxRevenue = theoreticalRevenue * taxAdjustmentFactor;
  
  // 5-2. 財政赤字（国債発行）を加算
  const fiscalDeficit = gdpEnhanced * fiscalDeficitRatio;
  const totalRevenue = adjustedTaxRevenue + fiscalDeficit;
  
  // 6. 固定コスト（UBIで削減不可）
  const fixedCost = gdpEnhanced * fixedCostRatio;
  
  // 7. 社会保険料（国民が別途負担する分）
  const socialInsuranceBurden = BASE_DATA.socialInsuranceAmount * gdpPerCapitaMultiplier * socialInsuranceRatio;
  
  // 8. 税収で賄う必要がある社会保険料分
  const socialInsuranceFromTax = BASE_DATA.socialInsuranceAmount * gdpPerCapitaMultiplier * (1 - socialInsuranceRatio);
  
  // 9. 社会保障コスト（従来型社会保障費、GDP比）
  const baseSocialSecurityCost = gdpEnhanced * (socialCostRatio - fixedCostRatio);
  
  // 10. 反復計算でUBI給付額と社会保障削減を決定
  // 初期値：社会保障削減なしと仮定
  let annualUBIPerPerson = 0;
  let socialSecurityCost = baseSocialSecurityCost;
  let netSurplus = 0;
  
  // 反復計算（最大5回まで）
  for (let i = 0; i < 5; i++) {
    // 総コスト = 固定コスト + 社会保障コスト + 社会保険料
    const totalCost = fixedCost + socialSecurityCost + socialInsuranceFromTax;
    
    // 純財政余剰
    netSurplus = totalRevenue - totalCost;
    
    // UBI給付可能額
    annualUBIPerPerson = netSurplus > 0 
      ? (netSurplus * 1_000_000_000_000) / BASE_DATA.population
      : 0;
    
    // UBI給付額に応じて社会保障コストを削減
    // 削減率 = (UBI給付額 / 平均社会保障給付額) × 削減可能率
    // 平均社会保障給付額：約100万円/年
    const averageSocialSecurityBenefit = 1_000_000;
    const reductionFactor = Math.min(annualUBIPerPerson / averageSocialSecurityBenefit, 1.0);
    const actualReductionRate = reductionFactor * socialSecurityReductionRate;
    
    // 次の反復で使う社会保障コスト
    socialSecurityCost = baseSocialSecurityCost * (1 - actualReductionRate);
  }
  const monthlyUBIPerPerson = annualUBIPerPerson / 12;
  
  // 11. インフレ率の計算
  // π = η · (Total_UBI / GDP)
  const totalUBIPayment = (annualUBIPerPerson * BASE_DATA.population) / 1_000_000_000_000; // 兆円
  const inflationRate = inflationSensitivity * (totalUBIPayment / gdpEnhanced);
  
  // 12. 実質購買力の計算
  const realAnnualUBI = annualUBIPerPerson / (1 + inflationRate);
  const realMonthlyUBI = realAnnualUBI / 12;
  
  // 13. 社会保障削減額の計算
  const socialSecurityReduction = baseSocialSecurityCost - socialSecurityCost;
  
  return {
    monthlyUBI: Math.round(monthlyUBIPerPerson),
    annualUBI: Math.round(annualUBIPerPerson),
    totalRevenue: Math.round(totalRevenue * 10) / 10,
    adjustedTaxRevenue: Math.round(adjustedTaxRevenue * 10) / 10,
    fiscalDeficit: Math.round(fiscalDeficit * 10) / 10,
    netSurplus: Math.round(netSurplus * 10) / 10,
    revenueBreakdown: {
      personal: Math.round(revenuePersonal * taxAdjustmentFactor * 10) / 10,
      corporate: Math.round(revenueCorporate * taxAdjustmentFactor * 10) / 10,
      consumption: Math.round(revenueConsumption * taxAdjustmentFactor * 10) / 10,
      property: Math.round(revenueProperty * taxAdjustmentFactor * 10) / 10,
    },
    gdpRatios: {
      totalRevenue: Math.round((totalRevenue / gdpEnhanced) * 1000) / 10,
      netSurplus: Math.round((netSurplus / gdpEnhanced) * 1000) / 10,
    },
    inflationRate: Math.round(inflationRate * 1000) / 10, // %表示用に10倍
    realMonthlyUBI: Math.round(realMonthlyUBI),
    realAnnualUBI: Math.round(realAnnualUBI),
    productivityCoefficient: Math.round(productivityCoefficient * 1000) / 1000,
    adjustedGDP: Math.round(gdpEnhanced * 10) / 10,
    socialSecurityReduction: Math.round(socialSecurityReduction * 10) / 10,
    totalUBIPayment: Math.round(totalUBIPayment * 10) / 10,
  };
}

/**
 * プリセットシナリオ
 */
export const PRESET_SCENARIOS: Record<string, { name: string; params: UBIParameters }> = {
  current: {
    name: "現状（2025年）",
    params: {
      alpha: 0.05,
      beta: 0.20,
      gamma: 1.0,
      taxPersonal: 0.08,   // 個人所得税率 8%
      taxCorporate: 0.30,  // 法人税率 30%
      taxConsumption: 0.10, // 消費税率 10%
      taxProperty: 0.017,  // 固定資産税率 1.7%
      socialCostRatio: 0.327, // 総歳出196兆円 / GDP 600兆円 = 32.7%
      gdpPerCapitaMultiplier: 1.0,
      socialInsuranceRatio: 1.0, // 現状維持（100%）
      taxAdjustmentFactor: 0.905, // 13兆円の調整（136.1→123.2）
      fiscalDeficitRatio: 0.048, // 財政赤字率 4.8%（GDP比、28.7兆円 ÷ 600兆円）
      fixedCostRatio: 0.129, // 固定コスト77.1兆円 / GDP 600兆円 = 12.9%
      socialSecurityReductionRate: 0.5, // 社会保障削減率 50%
      inflationSensitivity: 0.2, // インフレ感応度 η = 0.2
      taxSensitivity: 0.3, // 税率感応度 λ = 0.3
    },
  },
  moderate: {
    name: "中程度AI進展",
    params: {
      alpha: 0.30,
      beta: 0.50,
      gamma: 1.3,
      taxPersonal: 0.20,
      taxCorporate: 0.50,
      taxConsumption: 0.12,
      taxProperty: 0.02,
      socialCostRatio: 0.30, // AIによる効率化で若干減少
      gdpPerCapitaMultiplier: 1.2,
      socialInsuranceRatio: 0.5, // 半分を税収化
      taxAdjustmentFactor: 0.95, // 税制改革で捕捉率向上
      fiscalDeficitRatio: 0.02, // 財政赤字縮小 2%
      fixedCostRatio: 0.12, // AIによる効率化
      socialSecurityReductionRate: 0.6, // 削減率向上
      inflationSensitivity: 0.2,
      taxSensitivity: 0.3,
    },
  },
  advanced: {
    name: "高度AI進展",
    params: {
      alpha: 0.60,
      beta: 0.70,
      gamma: 1.6,
      taxPersonal: 0.15,
      taxCorporate: 0.70,
      taxConsumption: 0.15,
      taxProperty: 0.025,
      socialCostRatio: 0.25, // AIによる大幅な効率化
      gdpPerCapitaMultiplier: 1.5,
      socialInsuranceRatio: 0.2, // 80%を税収化
      taxAdjustmentFactor: 1.0, // 税制改革完了
      fiscalDeficitRatio: 0.0, // プライマリーバランス黒字化
      fixedCostRatio: 0.10, // 大幅な効率化
      socialSecurityReductionRate: 0.7, // 高い削減率
      inflationSensitivity: 0.2,
      taxSensitivity: 0.3,
    },
  },
  proposed: {
    name: "提案ケース",
    params: {
      alpha: 0.80,
      beta: 0.80,
      gamma: 1.8,
      taxPersonal: 0.10,
      taxCorporate: 0.80,
      taxConsumption: 0.15,
      taxProperty: 0.03,
      socialCostRatio: 0.20, // AIによる最大限の効率化
      gdpPerCapitaMultiplier: 1.8,
      socialInsuranceRatio: 0.0, // 完全税収化
      taxAdjustmentFactor: 1.0, // 税制改革完了
      fiscalDeficitRatio: 0.0, // プライマリーバランス黒字化
      fixedCostRatio: 0.08, // 最大限の効率化
      socialSecurityReductionRate: 0.8, // 最大削減率
      inflationSensitivity: 0.2,
      taxSensitivity: 0.3,
    },
  },
};
