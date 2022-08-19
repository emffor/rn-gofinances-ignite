import React from 'react';
import { HistoryCard } from '../../components/HistoryCard';

import {
    Container,
    Content,
    Title,
    Header
} from './styles';

export function Resumo() {
    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <HistoryCard
                title="Receitas"
                amount="R$ 0,00"
                color="#00BFA5"
            />
        </Container>
    );
}

