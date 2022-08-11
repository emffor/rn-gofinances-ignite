import React from 'react';

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

interface CategoryProps {
    name: string;
    icon: string;
}
//diminuindo o código com data
export interface TransactionCardProps {
    type: 'positive' | 'negative'; 
    title: string;
    amount: string;
    category: CategoryProps;
    date: string;
}

interface Props {
    data: TransactionCardProps;
}



export function TransactionCard({ data } : Props){ 
  return (
    <Container>
        <Title>{data.title}</Title>
        <Amount type={data.type}>
            {/* se o data.type for 'negative' acrescenta um sinal de - */}
            { data.type === 'negative' && '- '}
            { data.amount}           
        </Amount>

        <Footer>
            <Category>
                <Icon name= {data.category.icon}/>
                <CategoryName>{data.category.name}</CategoryName>
            </Category>
            <Date>{data.date}</Date>
        </Footer>
    </Container>
  );
}