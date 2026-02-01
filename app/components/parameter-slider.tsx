import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useColors } from "@/hooks/use-colors";

interface ParameterSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  multiplier?: number;
  description?: string;
  onInfoPress?: () => void;
}

export function ParameterSlider({
  label,
  value,
  onValueChange,
  min,
  max,
  step,
  unit = "",
  multiplier = 1,
  description,
  onInfoPress,
}: ParameterSliderProps) {
  const colors = useColors();
  const displayValue = Math.round(value * multiplier * 10) / 10;

  return (
    <View className="gap-2 py-2">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-foreground">{label}</Text>
          {onInfoPress && (
            <TouchableOpacity
              onPress={onInfoPress}
              className="w-5 h-5 rounded-full bg-muted items-center justify-center"
              style={{ opacity: 0.7 }}
            >
              <Text className="text-xs text-background font-bold">?</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-sm font-semibold text-primary">
          {displayValue}
          {unit}
        </Text>
      </View>

      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />

      {description && (
        <Text className="text-xs text-muted leading-relaxed">{description}</Text>
      )}
    </View>
  );
}
