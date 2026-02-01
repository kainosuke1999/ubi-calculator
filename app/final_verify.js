// 最終確認
const params = {
  alpha: 0.05,
  beta: 0.20,
  gamma: 1.0,
  taxPersonal: 0.102,
  taxCorporate: 0.655,
  taxConsumption: 0.061,
  taxProperty: 0.019,
  socialCostRatio: 0.168,
  gdpPerCapitaMultiplier: 1.0,
};

const BASE_GDP = 600;
const gdpEnhanced = BASE_GDP * params.gamma * params.gdpPerCapitaMultiplier;
const laborIncome = gdpEnhanced * (1 - params.alpha) * (1 - params.beta);
const capitalIncome = gdpEnhanced * (params.alpha + params.alpha * params.beta);

const revenuePersonal = laborIncome * params.taxPersonal;
const revenueCorporate = capitalIncome * params.taxCorporate;
const revenueConsumption = gdpEnhanced * params.taxConsumption;
const revenueProperty = gdpEnhanced * params.taxProperty;
const totalRevenue = revenuePersonal + revenueCorporate + revenueConsumption + revenueProperty;

console.log("=== 最終確認：修正後の現状シナリオ ===");
console.log(`GDP: ${gdpEnhanced.toFixed(1)}兆円`);
console.log(`総税収: ${totalRevenue.toFixed(1)}兆円`);
console.log(`税収のGDP比: ${(totalRevenue/gdpEnhanced*100).toFixed(2)}%`);
console.log("");
console.log("✓ 目標19.6%に対して: ${(totalRevenue/gdpEnhanced*100).toFixed(2)}%");
console.log("");
const socialCost = gdpEnhanced * params.socialCostRatio;
const netSurplus = totalRevenue - socialCost;
const monthlyUBI = (netSurplus * 1_000_000_000_000) / 125_000_000 / 12;
console.log(`社会維持コスト: ${socialCost.toFixed(1)}兆円`);
console.log(`純財政余剰: ${netSurplus.toFixed(1)}兆円`);
console.log(`月額UBI: ¥${Math.round(monthlyUBI).toLocaleString()}`);
