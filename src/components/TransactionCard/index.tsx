import React from 'react';
import { categories } from '../../utils/categories';

import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
} from './styles';

//diminuindo o código com data
export interface TransactionCardProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface Props {
    data: TransactionCardProps;
}



export function TransactionCard({ data }: Props) {
    //pegar os itens de acordo com a categoria.
    //percorrer cada item só que eu quero pegar o item que é igual ao data.category
    //[0] que dizer que só tenho uma unica categoria que as chaves são únicas. Então pego a primeira posição da listagem.
    const category = categories.filter(
        item => item.key === data.category
    )[0];

    return (
        <Container>
            <Title>{data.name}</Title>
            <Amount type={data.type}>
                {/* se o data.type for 'negative' acrescenta um sinal de - */}
                {data.type === 'negative' && '- '}
                {data.amount}
            </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    );
}