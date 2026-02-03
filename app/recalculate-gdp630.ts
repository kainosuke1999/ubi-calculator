import { calculateUBI, SCENARIOS } from './lib/ubi-calculator';

// GDP 630兆円に修正した現状シナリオ
const updatedCurrentScenario = {
  ...SCENARIOS.current,
  gdpBase: 630, // 600 → 630兆円に修正
};

console.log('=== GDP 630兆円での現状シナリオ再計算 ===\n');

const result = calculateUBI(updatedCurrentScenario);

console.log('【基本パラメーター】');
console.log(`GDP: ${updatedCurrentScenario.gdpBase}兆円`);
console.log(`AI労働代替率: ${updatedCurrentScenario.aiLaborSubstitutionRate * 100}%`);
console.log(`生産性向上率: ${updatedCurrentScenario.productivityGrowthRate * 100}%`);
console.log(`法人税率: ${updatedCurrentScenario.corporateTaxRate * 100}%`);
console.log(`所得税率: ${updatedCurrentScenario.incomeTaxRate * 100}%`);
console.log(`消費税率: ${updatedCurrentScenario.consumptionTaxRate * 100}%`);
console.log(`固定資産税率: ${updatedCurrentScenario.propertyTaxRate * 100}%`);
console.log(`その他税率: ${updatedCurrentScenario.otherTaxRate * 100}%`);
console.log(`財政赤字率: ${updatedCurrentScenario.fiscalDeficitRate * 100}%`);
console.log(`固定コスト率: ${updatedCurrentScenario.fixedCostRatio * 100}%`);
console.log(`社会保障削減率: ${updatedCurrentScenario.socialSecurityReductionRate * 100}%`);

console.log('\n【計算結果】');
console.log(`調整後GDP: ${result.adjustedGDP.toFixed(1)}兆円`);
console.log(`調整後税収: ${result.adjustedTaxRevenue.toFixed(1)}兆円`);
console.log(`財政赤字（国債発行）: ${result.fiscalDeficit.toFixed(1)}兆円`);
console.log(`総収入（税収+赤字）: ${result.totalRevenue.toFixed(1)}兆円`);
console.log(`社会維持コスト: ${result.socialMaintenanceCost.toFixed(1)}兆円`);
console.log(`純財政余剰: ${result.netFiscalSurplus.toFixed(1)}兆円`);
console.log(`月額UBI給付可能額: ¥${result.monthlyUBIPerPerson.toLocaleString()}`);
console.log(`年間UBI給付総額: ${result.totalUBIPayment.toFixed(1)}兆円`);

console.log('\n【税収内訳】');
console.log(`個人所得税: ${result.taxBreakdown.incomeTax.toFixed(1)}兆円`);
console.log(`法人税: ${result.taxBreakdown.corporateTax.toFixed(1)}兆円`);
console.log(`消費税: ${result.taxBreakdown.consumptionTax.toFixed(1)}兆円`);
console.log(`固定資産税: ${result.taxBreakdown.propertyTax.toFixed(1)}兆円`);
console.log(`その他税: ${result.taxBreakdown.otherTax.toFixed(1)}兆円`);
console.log(`総税収（GDP比）: ${result.totalTaxRatio.toFixed(1)}%`);

console.log('\n【財政赤字率の確認】');
const calculatedDeficitRate = (result.fiscalDeficit / result.adjustedGDP) * 100;
console.log(`財政赤字率（計算値）: ${calculatedDeficitRate.toFixed(2)}%`);
console.log(`財政赤字率（設定値）: ${updatedCurrentScenario.fiscalDeficitRate * 100}%`);

