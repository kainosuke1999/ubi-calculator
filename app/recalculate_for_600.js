// 600兆円のGDPで税収19.6%を達成する税率を計算
const TARGET_GDP = 600; // 兆円（モデルの基準）
const TARGET_TAX_RATIO = 0.196; // 19.6%
const TARGET_TAX_REVENUE = TARGET_GDP * TARGET_TAX_RATIO; // 117.6兆円

// 実際の税収構成比率（123.2兆円中）
const ACTUAL_PERSONAL = 38.9;
const ACTUAL_CORPORATE = 19.8;
const ACTUAL_CONSUMPTION = 30.5;
const ACTUAL_PROPERTY = 9.6;
const ACTUAL_OTHER = 22.0; // その他（モデルに含まれない）
const ACTUAL_TOTAL = 123.2;

// その他を除いた主要4税目の合計
const MAIN_FOUR_TOTAL = ACTUAL_PERSONAL + ACTUAL_CORPORATE + ACTUAL_CONSUMPTION + ACTUAL_PROPERTY; // 98.8兆円

// 主要4税目の構成比
const RATIO_PERSONAL = ACTUAL_PERSONAL / MAIN_FOUR_TOTAL;
const RATIO_CORPORATE = ACTUAL_CORPORATE / MAIN_FOUR_TOTAL;
const RATIO_CONSUMPTION = ACTUAL_CONSUMPTION / MAIN_FOUR_TOTAL;
const RATIO_PROPERTY = ACTUAL_PROPERTY / MAIN_FOUR_TOTAL;

// 600兆円GDPで19.6%の税収を、主要4税目で達成する場合の各税収
const TARGET_PERSONAL = TARGET_TAX_REVENUE * RATIO_PERSONAL;
const TARGET_CORPORATE = TARGET_TAX_REVENUE * RATIO_CORPORATE;
const TARGET_CONSUMPTION = TARGET_TAX_REVENUE * RATIO_CONSUMPTION;
const TARGET_PROPERTY = TARGET_TAX_REVENUE * RATIO_PROPERTY;

// 現状のパラメーター
const alpha = 0.05;
const beta = 0.20;

// 所得の推定
const laborIncome = TARGET_GDP * (1 - alpha) * (1 - beta);
const capitalIncome = TARGET_GDP * (alpha + alpha * beta);

// 必要な税率
const taxPersonal = TARGET_PERSONAL / laborIncome;
const taxCorporate = TARGET_CORPORATE / capitalIncome;
const taxConsumption = TARGET_CONSUMPTION / TARGET_GDP;
const taxProperty = TARGET_PROPERTY / TARGET_GDP;

console.log("=== 600兆円GDP基準での税率再計算 ===");
console.log(`目標GDP: ${TARGET_GDP}兆円`);
console.log(`目標税収: ${TARGET_TAX_REVENUE.toFixed(1)}兆円 (${(TARGET_TAX_RATIO*100).toFixed(1)}%)`);
console.log("");
console.log("実際の税収構成比を維持した場合の目標税収:");
console.log(`  個人所得税: ${TARGET_PERSONAL.toFixed(1)}兆円 (${(RATIO_PERSONAL*100).toFixed(1)}%)`);
console.log(`  法人税: ${TARGET_CORPORATE.toFixed(1)}兆円 (${(RATIO_CORPORATE*100).toFixed(1)}%)`);
console.log(`  消費税: ${TARGET_CONSUMPTION.toFixed(1)}兆円 (${(RATIO_CONSUMPTION*100).toFixed(1)}%)`);
console.log(`  固定資産税: ${TARGET_PROPERTY.toFixed(1)}兆円 (${(RATIO_PROPERTY*100).toFixed(1)}%)`);
console.log("");
console.log("推定所得:");
console.log(`  労働所得: ${laborIncome.toFixed(1)}兆円`);
console.log(`  資本所得: ${capitalIncome.toFixed(1)}兆円`);
console.log("");
console.log("必要な税率:");
console.log(`  taxPersonal: ${taxPersonal.toFixed(3)} (${(taxPersonal*100).toFixed(1)}%)`);
console.log(`  taxCorporate: ${taxCorporate.toFixed(3)} (${(taxCorporate*100).toFixed(1)}%)`);
console.log(`  taxConsumption: ${taxConsumption.toFixed(3)} (${(taxConsumption*100).toFixed(1)}%)`);
console.log(`  taxProperty: ${taxProperty.toFixed(3)} (${(taxProperty*100).toFixed(1)}%)`);
