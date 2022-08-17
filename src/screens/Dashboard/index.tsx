import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from './styles';

//criada para usar na listagem no keyExtractor / o export para o styCompon
export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  /* const data: DataListProps[] = [
      {
        id: '1',
        type: 'positive',
        title: 'Desenvolvimento de site',
        amount: 'R$ 12.000,00',
        category: {
          name: 'Vendas',
          icon: 'dollar-sign',
        },
        date: '13/04/2020',
      },
      {
        id: '2',
        type: 'negative',
        title: 'Hamburgueria Pizzy',
        amount: 'R$ 59,00',
        category: {
          name: 'Alimentação',
          icon: 'coffee',
        },
        date: '20/04/2020',
      },
      {
        id: '3',
        type: 'negative',
        title: 'Aluguel do apartamento',
        amount: 'R$ 1.200,00',
        category: {
          name: 'Casa',
          icon: 'shopping-bag',
        },
        date: '27/04/2020',
      }]; */

  const [data, setData] = useState<DataListProps[]>([]);

  useEffect(() => {
    async function loadTransactions() {
      const dataKey = '@gofinances:transactions';
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      //formatar transações para o formato que o componente TransactionCard esperar
      //percorre e formata ao mesmo tempo
      const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
          const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })

          const date = new Date(item.date)
          const dateFormatted = Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          }).format(date);

          return {
            id: item.id,
            name: item.name,
            amount,
            type: item.type,
            category: item.category,
            date: dateFormatted,
          }
        });
      setData(transactionsFormatted);
    }

    loadTransactions();
  }, []);

  return (
    <Container>
      <Header>
        <UserWrapper>

          <UserInfo>
            <Photo
              source={{ uri: 'https://github.com/emffor.png' }}
            />

            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Rodrigo, </UserName>
            </User>

          </UserInfo>

          <LogoutButton onPress={() => { }}>
            <Icon name='power' />

          </LogoutButton>

        </UserWrapper>

      </Header>

      <HighlightCards>

        <HighlightCard
          type='up'
          title='Entradas'
          amount='R$ 17.400,00'
          lastTransaction='Última entrada dia 13 de abril'
        />

        <HighlightCard
          type='down'
          title='Saídas'
          amount='R$ 1.259,00'
          lastTransaction='Última saída dia 03 de abril'
        />

        <HighlightCard
          type='total'
          title='Total'
          amount='R$ 16.141,00'
          lastTransaction='01 à 16 de abril'
        />


      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

        {/* <TransactionCard data={data[0]}/>  tinha q ser passado com esse zero pq tem q pegar o primeiro objeto*/}


      </Transactions>

    </Container>
  );
}

