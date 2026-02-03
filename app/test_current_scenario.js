// 現状シナリオの税収比率を計算
const params = {
  alpha: 0.05,
  beta: 0.20,
  gamma: 1.0,
  taxPersonal: 0.20,
  taxCorporate: 0.30,
  taxConsumption: 0.10,
  taxProperty: 0.015,
  socialCostRatio: 0.168,
  gdpPerCapitaMultiplier: 1.0,
};

const BASE_GDP = 600; // 兆円

// 計算
const gdpEnhanced = BASE_GDP * params.gamma * params.gdpPerCapitaMultiplier;
const laborShare = 1 - params.alpha;
const capitalShare = params.alpha;
const laborIncome = gdpEnhanced * laborShare * (1 - params.beta);
const capitalIncome = gdpEnhanced * (capitalShare + params.alpha * params.beta);

const revenuePersonal = laborIncome * params.taxPersonal;
const revenueCorporate = capitalIncome * params.taxCorporate;
const revenueConsumption = gdpEnhanced * params.taxConsumption;
const revenueProperty = gdpEnhanced * params.taxProperty;

const totalRevenue = revenuePersonal + revenueCorporate + revenueConsumption + revenueProperty;
const revenueRatio = (totalRevenue / gdpEnhanced) * 100;

console.log("=== 現状シナリオの税収分析 ===");
console.log(`GDP: ${gdpEnhanced.toFixed(1)}兆円`);
console.log(`総税収: ${totalRevenue.toFixed(1)}兆円`);
console.log(`税収のGDP比: ${revenueRatio.toFixed(1)}%`);
console.log("");
console.log("内訳:");
console.log(`  個人所得税: ${revenuePersonal.toFixed(1)}兆円 (${(revenuePersonal/gdpEnhanced*100).toFixed(1)}%)`);
console.log(`  法人税: ${revenueCorporate.toFixed(1)}兆円 (${(revenueCorporate/gdpEnhanced*100).toFixed(1)}%)`);
console.log(`  消費税: ${revenueConsumption.toFixed(1)}兆円 (${(revenueConsumption/gdpEnhanced*100).toFixed(1)}%)`);
console.log(`  固定資産税: ${revenueProperty.toFixed(1)}兆円 (${(revenueProperty/gdpEnhanced*100).toFixed(1)}%)`);
console.log("");
console.log(`目標: 19.6%`);
console.log(`現在: ${revenueRatio.toFixed(1)}%`);
console.log(`差分: ${(revenueRatio - 19.6).toFixed(1)}%ポイント`);
