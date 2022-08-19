import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from "date-fns/locale";

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { VictoryPie } from "victory-native";

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import {
    Container,
    Content,
    Title,
    Header,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}
interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resumo() {
    const theme = useTheme();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    function handleDateChange(action: 'next' | 'prev') {
        if (action === 'next') {
            const newDate = addMonths(selectedDate, 1);
            setSelectedDate(newDate);
            /* console.log(newDate); */
        } else {
            const newDate = subMonths(selectedDate, 1);
            setSelectedDate(newDate);
            /* console.log(newDate); */
        }
    }

    async function loadData() {

        //Acesso ao AsyncStorage para buscar o dataKey.
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];
        /* console.log(responseFormatted); */


        //transações de saida
        //comparar se o ano é o mesmo e se o mês é o mesmo 
        const expensives = responseFormatted.filter(
            (expensive: TransactionData) =>
                expensive.type === "negative" &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        );

        //reduce para somar os valores de cada categoria
        const expensivesTotal = expensives
            .reduce((accumulator: number, expensive: TransactionData) => {
                return accumulator + Number(expensive.amount);
            }, 0);

        //total
        /* console.log(expensivesTotal); */


        //vetor auxiliar para armazenar as transações de saida
        const totalByCategory: CategoryData[] = [];

        //forEach não tem retorno de objeto, diferente do map
        //vou rodar exemplo 10 vezes cada categoria vou rodar um expansive se for igual a categoria soma o valor.
        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });

            //adicionando o valor da categoria no vetor auxiliar se o valor for maior que 0.
            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })

                //adicionando o valor da categoria no vetor auxiliar.
                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name, //nome da categoria
                    color: category.color, //cor da categoria
                    total: categorySum, //soma dos valores da categoria
                    totalFormatted, //formatar o valor da categoria
                    percent, //percentual da categoria
                })
            }
        });

        setTotalByCategories(totalByCategory);

        /* console.log(totalByCategory); */

    }

    useEffect(() => {
        loadData();
    }, []);

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: useBottomTabBarHeight(),
                    paddingHorizontal: RFValue(24),
                }}
            >

                <MonthSelect>
                    <MonthSelectButton
                        onPress={() => handleDateChange('prev')}
                    >
                        <MonthSelectIcon name="chevron-left" />
                    </MonthSelectButton>

                    <Month>
                        {/* format month */}
                        {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                    </Month>

                    <MonthSelectButton
                        onPress={() => handleDateChange('next')}
                    >
                        <MonthSelectIcon name="chevron-right" />
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(15),
                                fontWeight: 'bold',
                                fill: theme.colors.shape,
                            }
                        }}
                        labelRadius={90} //leva pra dentro os numeros
                        x="percent"
                        y="total"
                    />
                </ChartContainer>


                {
                    totalByCategories.map((category: CategoryData) => (
                        <HistoryCard
                            key={category.key}
                            title={category.name}
                            amount={category.totalFormatted}
                            color={category.color}
                        />
                    ))
                }

            </Content>
        </Container>
    );
}

