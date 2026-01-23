import React from "react";
import { Tabs } from "expo-router";
import { Navbar, TabConfigItem } from "@/components/Navbar";

export const TABS_CONFIG: ReadonlyArray<TabConfigItem> = [
    { name: "Liked Songs", screenName: "index", iconName: "home" },
    { name: "Search", screenName: "search", iconName: "search" },
    { name: "Settings", screenName: "settings", iconName: "settings" },
] as const;

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => {
                const activeScreenName =
                    props.state.routes[props.state.index].name;
                return (
                    <Navbar
                        tabsConfig={TABS_CONFIG}
                        currentScreenName={activeScreenName}
                        navigation={props.navigation}
                    />
                );
            }}
        >
            {TABS_CONFIG.map((tab) => (
                <Tabs.Screen
                    key={tab.screenName}
                    name={tab.screenName}
                    options={{ header: () => null }}
                />
            ))}
        </Tabs>
    );
}
