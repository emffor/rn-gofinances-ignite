import React from "react";
import { Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from "styled-components";

import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const theme = useTheme();

    return (
        <Navigator
            screenOptions={{
                headerShown: false,//tira o header.
                tabBarActiveTintColor: theme.colors.secondary,//cor quando ativo.
                tabBarInactiveTintColor: theme.colors.text, //cor nao ativado.
                tabBarLabelPosition: 'beside-icon', //ícone ao lado do nome.
                tabBarStyle: {
                    height: 88,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                }, //estilização pra barra 
            }}
        >
            <Screen
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size} //size desestruturado pega do screOpt
                            color={color} //cor desestruturado
                        />
                    )
                }}
            />
            <Screen
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons
                            name="attach-money"
                            size={size} //size desestruturado pega do screOpt
                            color={color} //cor desestruturado
                        />
                    )
                }}
            />
            <Screen
                name="Resumo"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons
                            name="pie-chart"
                            size={size} //size desestruturado pega do screOpt
                            color={color} //cor desestruturado
                        />
                    )
                }}
            />
        </Navigator>
    )
}