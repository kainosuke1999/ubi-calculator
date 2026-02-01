import { calculateUBI, PRESET_SCENARIOS } from './lib/ubi-calculator';

// GDP 630兆円に修正した現状シナリオ
const updatedCurrentParams = {
  ...PRESET_SCENARIOS.current.params,
  gdpPerCapitaMultiplier: 630 / 500, // GDP 630兆円 ÷ 基準500兆円 = 1.26
};

console.log('=== GDP 630兆円での現状シナリオ再計算 ===\n');

const result = calculateUBI(updatedCurrentParams);

console.log('【基本パラメーター】');
console.log(`GDP倍率: ${updatedCurrentParams.gdpPerCapitaMultiplier.toFixed(2)}（630兆円相当）`);
console.log(`AI労働代替率: ${updatedCurrentParams.alpha * 100}%`);
console.log(`生産性向上率: ${(updatedCurrentParams.gamma - 1) * 100}%`);
console.log(`法人税率: ${updatedCurrentParams.taxCorporate * 100}%`);
console.log(`所得税率: ${updatedCurrentParams.taxPersonal * 100}%`);
console.log(`消費税率: ${updatedCurrentParams.taxConsumption * 100}%`);
console.log(`固定資産税率: ${updatedCurrentParams.taxProperty * 100}%`);
console.log(`財政赤字率: ${updatedCurrentParams.fiscalDeficitRatio * 100}%`);
console.log(`固定コスト率: ${updatedCurrentParams.fixedCostRatio * 100}%`);
console.log(`社会保障削減率: ${updatedCurrentParams.socialSecurityReductionRate * 100}%`);

console.log('\n【計算結果】');
console.log(`調整後税収: ${result.adjustedTaxRevenue.toFixed(1)}兆円`);
console.log(`財政赤字（国債発行）: ${result.fiscalDeficit.toFixed(1)}兆円`);
console.log(`総収入（税収+赤字）: ${result.totalRevenue.toFixed(1)}兆円`);
console.log(`純財政余剰: ${result.netSurplus.toFixed(1)}兆円`);
console.log(`月額UBI給付可能額: ¥${result.monthlyUBI.toLocaleString()}`);
console.log(`年額UBI給付可能額: ¥${result.annualUBI.toLocaleString()}`);

