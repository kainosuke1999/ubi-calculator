// GDP 630兆円での現状シナリオの検証

const GDP_BASE = 630; // 兆円
const POPULATION = 125_000_000;

// 現状シナリオのパラメーター
const params = {
  alpha: 0.05,           // AI労働代替率 5%
  beta: 0.7,             // 資本収益集中度
  taxCorporate: 0.30,    // 法人税率 30%
  taxPersonal: 0.08,     // 所得税率 8%
  taxConsumption: 0.10,  // 消費税率 10%
  taxProperty: 0.017,    // 固定資産税率 1.7%
  fiscalDeficitRatio: 0.046, // 財政赤字率 4.6%
  fixedCostRatio: 0.129, // 固定コスト率 12.9%
  socialSecurityCostRatio: 0.198, // 社会保障コスト率 19.8%
  socialSecurityReductionRate: 0.50, // 最大社会保障削減率 50%
  gdpPerCapitaMultiplier: 1.0, // GDP倍率（基準値）
  gamma0: 1.0,           // 基準生産性
  lambda: 0.3,           // 税率感応度
};

// 生産性係数
const gamma = params.gamma0 * (1 - params.lambda * params.taxCorporate);
console.log(`生産性係数 γ = ${gamma.toFixed(4)}`);

// GDP計算
const GDP = GDP_BASE * params.gdpPerCapitaMultiplier * gamma;
console.log(`GDP = ${GDP.toFixed(1)}兆円`);

// 法人資本所得
const K_corporate = (params.alpha + (1 - params.alpha) * params.beta) * GDP;
console.log(`法人資本所得 = ${K_corporate.toFixed(1)}兆円`);

// 個人労働所得
const L_personal = (1 - params.alpha) * (1 - params.beta) * GDP;
console.log(`個人労働所得 = ${L_personal.toFixed(1)}兆円`);

// 税収計算
const taxRevenueCorporate = params.taxCorporate * K_corporate;
const taxRevenuePersonal = params.taxPersonal * L_personal;
const taxRevenueConsumption = params.taxConsumption * GDP * 0.6; // 消費性向60%
const taxRevenueProperty = params.taxProperty * GDP;

const totalTaxRevenue = taxRevenueCorporate + taxRevenuePersonal + taxRevenueConsumption + taxRevenueProperty;

console.log(`\n【税収内訳】`);
console.log(`法人税収: ${taxRevenueCorporate.toFixed(1)}兆円`);
console.log(`所得税収: ${taxRevenuePersonal.toFixed(1)}兆円`);
console.log(`消費税収: ${taxRevenueConsumption.toFixed(1)}兆円`);
console.log(`固定資産税収: ${taxRevenueProperty.toFixed(1)}兆円`);
console.log(`合計税収: ${totalTaxRevenue.toFixed(1)}兆円`);

// 財政赤字
const fiscalDeficit = params.fiscalDeficitRatio * GDP;
console.log(`\n財政赤字: ${fiscalDeficit.toFixed(1)}兆円`);

// 総収入
const totalRevenue = totalTaxRevenue + fiscalDeficit;
console.log(`総収入: ${totalRevenue.toFixed(1)}兆円`);

// 固定コスト
const fixedCost = params.fixedCostRatio * GDP;
console.log(`\n固定コスト: ${fixedCost.toFixed(1)}兆円`);

// 社会保障コスト（UBI=0の場合、削減なし）
const socialSecurityCost = params.socialSecurityCostRatio * GDP;
console.log(`社会保障コスト: ${socialSecurityCost.toFixed(1)}兆円`);

// 総コスト
const totalCost = fixedCost + socialSecurityCost;
console.log(`総コスト: ${totalCost.toFixed(1)}兆円`);

// 純財政余剰
const netSurplus = totalRevenue - totalCost;
console.log(`\n純財政余剰: ${netSurplus.toFixed(1)}兆円`);

if (netSurplus < 0) {
  console.log(`\n結論: UBI給付は不可能（赤字 ${Math.abs(netSurplus).toFixed(1)}兆円）`);
} else {
  const annualUBI = (netSurplus * 1_000_000_000_000) / POPULATION;
  const monthlyUBI = annualUBI / 12;
  console.log(`\n月額UBI: ¥${Math.floor(monthlyUBI).toLocaleString()}`);
  console.log(`年額UBI: ¥${Math.floor(annualUBI).toLocaleString()}`);
}
