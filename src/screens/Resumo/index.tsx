import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import {
    Container,
    Content,
    Title,
    Header
} from './styles';
import { useFocusEffect } from '@react-navigation/native';
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
    total: string;
    color: string;
}

export function Resumo() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    async function loadData() {

        //Acesso ao AsyncStorage para buscar o dataKey.
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];
        /* console.log(responseFormatted); */


        //transações de saida
        const expensives = responseFormatted
            .filter((expensive: TransactionData) => expensive.type === 'negative');

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
                const total = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })

                totalByCategory.push({
                    key: category.key,
                    name: category.name, //nome da categoria
                    color: category.color, //cor da categoria
                    total //soma dos valores da categoria
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
    }, []));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>


            <Content>
                {
                    totalByCategories.map((category: CategoryData) => (
                        <HistoryCard
                            key={category.key}
                            title={category.name}
                            amount={category.total}
                            color={category.color}
                        />
                    ))
                }
            </Content>
        </Container>
    );
}

