import { Pressable, PressableProps } from "react-native";
import { useHaptic } from "../contexts/HapticContext";

export const HapticPressable = (props: PressableProps) => {
    const { triggerHaptic } = useHaptic();

    return (
        <Pressable
            {...props}
            onPress={(event) => {
                triggerHaptic();
                props.onPress?.(event);
            }}
            android_disableSound={true}
        />
    );
};

