import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { HapticPressable } from "./HapticPressable";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";

export interface TabConfigItem {
    name: string;
    screenName: string;
    iconName: keyof typeof MaterialIcons.glyphMap;
}

interface NavbarProps {
    tabsConfig?: ReadonlyArray<TabConfigItem>;
    currentScreenName: string;
    navigation: BottomTabBarProps["navigation"];
}

export function Navbar({
    tabsConfig,
    currentScreenName,
    navigation,
}: NavbarProps) {
    const { invertColors } = useInvertColors();
    const activeColor = invertColors ? "black" : "white";
    const inactiveColor = invertColors ? "#C1C1C1" : "#6E6E6E";

    return (
        <View
            style={[
                styles.navbar,
                { backgroundColor: invertColors ? "white" : "black" },
            ]}
        >
            {tabsConfig?.map((tab) => {
                const isActive = tab.screenName === currentScreenName;
                return (
                    <HapticPressable
                        key={tab.screenName}
                        onPress={() => navigation.navigate(tab.screenName)}
                    >
                        <MaterialIcons
                            name={tab.iconName}
                            size={n(48)}
                            color={isActive ? activeColor : inactiveColor}
                        />
                    </HapticPressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: n(11),
        paddingHorizontal: n(20),
    },
});
