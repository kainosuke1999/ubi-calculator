// 実際のデータから税率を逆算
const GDP = 630; // 兆円
const totalTaxRevenue = 123.2; // 兆円

// 実際の税収内訳
const personalIncomeTax = 38.9; // 兆円
const corporateTax = 19.8; // 兆円
const consumptionTax = 30.5; // 兆円
const propertyTax = 9.6; // 兆円
const otherTax = 22.0; // 兆円（その他）

// 現状のパラメーター（AI代替率5%、資本集中度20%）
const alpha = 0.05;
const beta = 0.20;

// 労働所得と資本所得の推定
const laborShare = 1 - alpha; // 95%
const laborIncome = GDP * laborShare * (1 - beta); // 人間の労働所得
const capitalIncome = GDP * (alpha + alpha * beta); // 資本所得

console.log("=== 実際のデータから税率を逆算 ===");
console.log(`GDP: ${GDP}兆円`);
console.log(`総税収: ${totalTaxRevenue}兆円 (${(totalTaxRevenue/GDP*100).toFixed(1)}%)`);
console.log("");
console.log("推定所得:");
console.log(`  労働所得: ${laborIncome.toFixed(1)}兆円`);
console.log(`  資本所得: ${capitalIncome.toFixed(1)}兆円`);
console.log("");
console.log("実際の税収と逆算税率:");
console.log(`  個人所得税: ${personalIncomeTax}兆円 → 税率 ${(personalIncomeTax/laborIncome*100).toFixed(1)}%`);
console.log(`  法人税: ${corporateTax}兆円 → 税率 ${(corporateTax/capitalIncome*100).toFixed(1)}%`);
console.log(`  消費税: ${consumptionTax}兆円 → 税率 ${(consumptionTax/GDP*100).toFixed(1)}%`);
console.log(`  固定資産税: ${propertyTax}兆円 → 税率 ${(propertyTax/GDP*100).toFixed(1)}%`);
console.log("");
console.log("推奨パラメーター設定:");
console.log(`  taxPersonal: ${(personalIncomeTax/laborIncome).toFixed(3)}`);
console.log(`  taxCorporate: ${(corporateTax/capitalIncome).toFixed(3)}`);
console.log(`  taxConsumption: ${(consumptionTax/GDP).toFixed(3)}`);
console.log(`  taxProperty: ${(propertyTax/GDP).toFixed(3)}`);
