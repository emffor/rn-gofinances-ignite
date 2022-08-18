import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

//Recarregar tela.
import { useFocusEffect } from '@react-navigation/native';

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

interface HighlightProps {
  total: string;
}
interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
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

  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);


  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    //soma

    let entriesTotal = 0;
    let expensiveTotal = 0;

    //formatar transações para o formato que o componente TransactionCard esperar
    //percorre e formata ao mesmo tempo
    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {

        //verificando se é igual a positive para fazer a soma else ...rest
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount); //o que tem salvo + novoValor
        } else {
          expensiveTotal += Number(item.amount);
        }

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

    setTransactions(transactionsFormatted);

    setHighlightData({
      entries: {
        total: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      },
      expensives: {
        total: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      }
    })
  }

  //carregar loadTransactions();
  useEffect(() => {
    loadTransactions();

    //LIMPAR LISTA DE TRANSACTION
    /* const dataKey = '@gofinances:transactions';
    AsyncStorage.removeItem(dataKey); */
  }, []);

  //Recarregar tela
  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

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
          amount={highlightData.entries.total}
          lastTransaction='Última entrada dia 13 de abril'
        />

        <HighlightCard
          type='down'
          title='Saídas'
          amount={highlightData.expensives.total}
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
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

        {/* <TransactionCard data={data[0]}/>  tinha q ser passado com esse zero pq tem q pegar o primeiro objeto*/}


      </Transactions>

    </Container>
  );
}

