import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function InfoModal({ visible, onClose, title, content }: InfoModalProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center p-6"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl w-full max-w-md"
          style={{ maxHeight: "80%" }}
        >
          <View className="p-6 gap-4">
            <Text className="text-xl font-bold text-foreground">{title}</Text>
            <ScrollView className="max-h-96">
              <Text className="text-base text-foreground leading-relaxed">
                {content}
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={onClose}
              className="bg-primary py-3 rounded-full"
              style={{ opacity: 0.9 }}
            >
              <Text className="text-background text-center font-semibold">
                閉じる
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// 各パラメーターの説明文
export const PARAMETER_EXPLANATIONS: Record<string, { title: string; content: string }> = {
  alpha: {
    title: "AI労働代替率とは？",
    content:
      "AIが人間の仕事を代替する比率を示します。\n\n" +
      "• 0%：AIによる代替なし（現状）\n" +
      "• 50%：半分の仕事がAIに代替\n" +
      "• 100%：すべての仕事がAIに代替\n\n" +
      "AI代替率が高いほど、人間の労働所得は減少しますが、資本所得（企業の利益）が増加します。これにより法人税収が増加し、UBIの財源となります。",
  },
  beta: {
    title: "資本収益集中度とは？",
    content:
      "生産性向上の果実が資本（企業・株主）に集中する度合いを示します。\n\n" +
      "• 0%：すべて労働者に分配\n" +
      "• 50%：半分が資本に集中\n" +
      "• 100%：すべて資本に集中\n\n" +
      "資本収益集中度が高いほど、個人所得税収は減少しますが、法人税収が増加します。",
  },
  gamma: {
    title: "生産性向上率とは？",
    content:
      "AIによる生産性の向上倍率を示します。\n\n" +
      "• 1.0倍：生産性向上なし（現状）\n" +
      "• 1.5倍：生産性が1.5倍に向上\n" +
      "• 2.0倍：生産性が2倍に向上\n\n" +
      "生産性が向上すると、GDPが増加し、税収も増加します。",
  },
  gdpPerCapitaMultiplier: {
    title: "1人あたりGDP倍率とは？",
    content:
      "現在の日本の1人あたりGDP（約480万円）に対する倍率を示します。\n\n" +
      "• 1.0倍：現状維持\n" +
      "• 1.5倍：1人あたりGDPが720万円に\n" +
      "• 2.0倍：1人あたりGDPが960万円に\n\n" +
      "経済成長により1人あたりGDPが増加すると、税収も増加します。",
  },
  socialCostRatio: {
    title: "社会維持コストとは？",
    content:
      "医療・年金・防衛費・公共事業など、UBI以外の政府支出の合計をGDP比で示します。\n\n" +
      "現状の日本：約32.7%（196兆円 / GDP 600兆円）\n\n" +
      "内訳：\n" +
      "• 固定コスト（12.9%）：国債費、防衛費、公共事業など\n" +
      "• 社会保障コスト（19.8%）：年金、医療、介護など\n\n" +
      "社会保障コストはUBI給付により削減可能ですが、固定コストは削減できません。",
  },
  fixedCostRatio: {
    title: "固定コスト率とは？",
    content:
      "UBIで削減不可能な政府支出をGDP比で示します。\n\n" +
      "現状の日本：約12.9%（77.1兆円 / GDP 600兆円）\n\n" +
      "内訳：\n" +
      "• 国債費（利払い・償還）：27.3兆円\n" +
      "• 防衛費：8.9兆円\n" +
      "• 公共事業：6.0兆円\n" +
      "• 地方交付税：16.0兆円\n" +
      "• 教育費：5.3兆円\n" +
      "• その他行政費：13.6兆円\n\n" +
      "これらはUBI導入後も維持する必要があります。",
  },
  socialSecurityReductionRate: {
    title: "社会保障削減率とは？",
    content:
      "UBI給付により削減可能な社会保障費の割合を示します。\n\n" +
      "削減可能な制度：\n" +
      "• 基礎年金（100%削減可能）\n" +
      "• 生活保護（100%削減可能）\n" +
      "• 児童手当（100%削減可能）\n" +
      "• 失業保険（80%削減可能）\n\n" +
      "削減困難な制度：\n" +
      "• 医療費（ほぼ削減不可）\n" +
      "• 介護費（ほぼ削減不可）\n" +
      "• 報酬比例年金（維持）\n\n" +
      "現状モデルでは平均50%の削減率を想定しています。",
  },
  socialInsuranceRatio: {
    title: "社会保険料維持率とは？",
    content:
      "現在の社会保険料（82.2兆円）を国民が別途負担する割合を示します。\n\n" +
      "• 100%：現状維持（国民が全額負担）\n" +
      "• 50%：半分を税収化（国民負担が半減）\n" +
      "• 0%：完全税収化（国民負担なし）\n\n" +
      "社会保険料を税収化すると、国民の可処分所得が増加しますが、政府の税収で賄う必要があります。",
  },
  taxAdjustmentFactor: {
    title: "税収調整係数とは？",
    content:
      "理論的な税収と実際の税収のギャップを調整する係数です。\n\n" +
      "ギャップの原因：\n" +
      "• 税の捕捉率（100%ではない）\n" +
      "• 軽減税率（消費税8%の品目）\n" +
      "• 各種控除・減免措置\n" +
      "• 地下経済の存在\n\n" +
      "現状の日本：約0.905（理論値の90.5%）\n\n" +
      "税制改革により捕捉率を向上させることで、この係数を1.0に近づけることができます。",
  },
  fiscalDeficitRatio: {
    title: "財政赤字率とは？",
    content:
      "国債発行による財政赤字の規模をGDP比で示します。\n\n" +
      "現状の日本（2025年度）：約3.6%（21.6兆円 / GDP 600兆円）\n\n" +
      "• 0%：均衡財政（税収で全支出を賄う）\n" +
      "• 3.6%：現状（税収不足を国債で補填）\n" +
      "• 10%：大幅な財政赤字\n\n" +
      "財政赤字は将来世代への負担となるため、持続可能なUBIを実現するには、財政赤字を削減する必要があります。",
  },
  taxPersonal: {
    title: "個人所得税率とは？",
    content:
      "個人の労働所得に対する税率を示します。\n\n" +
      "現状の日本：約8%（平均実効税率）\n\n" +
      "日本の所得税は累進課税制度を採用しており、所得が高いほど税率が上がります（5%〜45%）。モデルでは平均実効税率を使用しています。",
  },
  taxCorporate: {
    title: "法人税率とは？",
    content:
      "企業の利益に対する税率を示します。\n\n" +
      "現状の日本：約30%（実効税率、地方税含む）\n\n" +
      "法人税率が高いほど税収は増加しますが、企業の投資意欲や国際競争力に影響を与える可能性があります。",
  },
  taxConsumption: {
    title: "消費税率とは？",
    content:
      "商品・サービスの購入時に課される税率を示します。\n\n" +
      "現状の日本：10%（標準税率）\n\n" +
      "消費税は安定した税収源ですが、逆進性（低所得者ほど負担が重い）という問題があります。",
  },
  taxProperty: {
    title: "固定資産税率とは？",
    content:
      "土地・建物などの固定資産に対する税率を示します。\n\n" +
      "現状の日本：約1.7%（標準税率1.4% + 都市計画税0.3%）\n\n" +
      "固定資産税は地方自治体の重要な財源です。",
  },
  calculation: {
    title: "UBI給付額の計算方法",
    content:
      "月額UBI給付額は以下の手順で計算されます：\n\n" +
      "1. 税収の計算\n" +
      "   • 個人所得税\n" +
      "   • 法人税\n" +
      "   • 消費税\n" +
      "   • 固定資産税\n\n" +
      "2. 財政赤字を加算\n" +
      "   総収入 = 税収 + 財政赤字\n\n" +
      "3. 社会維持コストを差し引く\n" +
      "   • 固定コスト（削減不可）\n" +
      "   • 社会保障コスト（UBI給付額に応じて削減）\n\n" +
      "4. 純財政余剰を計算\n" +
      "   純財政余剰 = 総収入 - 社会維持コスト\n\n" +
      "5. 人口で割ってUBI給付額を算出\n" +
      "   月額UBI = 純財政余剰 / 人口 / 12ヶ月\n\n" +
      "※ 社会保障コストの削減は反復計算により決定されます。",
  },
};
