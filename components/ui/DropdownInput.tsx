import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  label: string;
  error?: string | undefined;
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  style?: object;
};

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export default function DropdownInput({
  label,
  error,
  value,
  onSelect,
  options,
  style,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [layout, setLayout] = useState<null | {
    top: number;
    left: number;
    width: number;
  }>(null);
  const DropdownButton = useRef<View>(null);

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);
  const labelY = useSharedValue(0);
  const inputColor = useSharedValue(COLORS.gray);
  const labelFontSize = useSharedValue(16);
  const iconRotation = useSharedValue("0deg");

  const dropdownStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(dropdownHeight.value, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      }),
      opacity: withTiming(dropdownOpacity.value, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      }),
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(inputColor.value, { duration: 250 }),
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(labelY.value, { stiffness: 1200 }) },
      ],
      fontSize: withSpring(labelFontSize.value, { stiffness: 1200 }),
      color: withTiming(inputColor.value, { duration: 250 }),
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: withSpring(iconRotation.value, { stiffness: 1200 }) },
      ],
      color: withTiming(inputColor.value, { duration: 250 }),
    };
  });

  useEffect(() => {
    if (value && value.length > 0) {
      labelY.value = -20;
      labelFontSize.value = 12;
    } else {
      labelY.value = 0;
      labelFontSize.value = 16;
    }
  }, [value]);

  useEffect(() => {
    if (isDropdownOpen) {
      dropdownHeight.value = 200;
      dropdownOpacity.value = 1;
      inputColor.value = COLORS.primary;
      iconRotation.value = "180deg";
    } else {
      dropdownHeight.value = 0;
      dropdownOpacity.value = 0;
      inputColor.value = COLORS.gray;
      iconRotation.value = "0deg";
    }
  }, [isDropdownOpen]);

  const handleOnSelectOption = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsDropdownOpen(false);
  };

  const openDropdown = () => {
    DropdownButton.current?.measureInWindow(
      (px: number, py: number, width: number, height: number) => {
        setLayout({
          top: py + height,
          left: px,
          width: width,
        });
        setIsDropdownOpen(true);
      }
    );
  };

  return (
    <View ref={DropdownButton} style={[styles.container, style]}>
      <AnimatedPressable
        onPress={openDropdown}
        style={[styles.inputContainer, borderStyle]}
      >
        <View style={styles.labelContainer}>
          <AnimatedText style={[styles.label, labelStyle]}>
            {label}
          </AnimatedText>
          <Text style={styles.text}>{value}</Text>
        </View>
        <AnimatedIcon name="chevron-down" style={[styles.icon, iconStyle]} />
      </AnimatedPressable>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={isDropdownOpen} transparent animationType="none">
        <Pressable
          style={styles.overlay}
          onPress={() => setIsDropdownOpen(false)}
        />
        {layout && (
          <AnimatedView
            style={[
              styles.optionsContainer,
              { top: layout.top, left: layout.left, width: layout.width },
              dropdownStyle,
            ]}
          >
            <FlatList
              data={options}
              persistentScrollbar={true}
              renderItem={({ item }) => (
                <Item
                  item={item}
                  handleOnSelectOption={handleOnSelectOption}
                  selectedItem={value}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              indicatorStyle="white"
            />
          </AnimatedView>
        )}
      </Modal>
    </View>
  );
}

type ItemProps = {
  item: string;
  handleOnSelectOption: (value: string) => void;
  selectedItem: string;
};

function Item({ item, handleOnSelectOption, selectedItem }: ItemProps) {
  const isSelected = item === selectedItem;

  return (
    <Pressable
      onPress={() => handleOnSelectOption(item)}
      style={({ pressed }) => [
        styles.optionItem,
        pressed && styles.optionPressed,
        isSelected && styles.optionSelected,
      ]}
    >
      <Text style={styles.optionText}>{item}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
  },
  inputContainer: {
    paddingBottom: 10,
    maxWidth: 500,
    height: 60,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  labelContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  label: {
    color: COLORS.gray,
    position: "absolute",
    left: 0,
  },
  text: {
    color: COLORS.text,
    paddingTop: 10,
    paddingBottom: 0,
    height: 25,
  },
  icon: {
    color: COLORS.gray,
    fontSize: 20,
    marginBottom: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  optionsContainer: {
    position: "absolute",
    borderRadius: 8,
    backgroundColor: COLORS.dropdownInput,
  },
  optionItem: {
    padding: 15,
  },
  optionText: {
    color: COLORS.gray,
  },
  optionPressed: {
    backgroundColor: COLORS.ripple,
  },
  optionSelected: {
    backgroundColor: COLORS.ripple,
  },
  errorText: {
    position: "absolute",
    fontSize: 12,
    bottom: -20,
    color: COLORS.error,
  },
});
