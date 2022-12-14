import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useTheme } from 'styled-components';

//Recarregar tela.
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from "../../hook/auth";

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
  LoadContainer
} from './styles';

//criada para usar na listagem no keyExtractor / o export para o styCompon
export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
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

  const theme = useTheme();
  const { signOut, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);


  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {

    //para tirar o NaN quando não tiver nenhum dado.
    const collectionFiltered = collection.filter(transaction => transaction.type === type);

    if (collectionFiltered.length === 0)
      return 0;


    /* console.log(type, collectionFiltered); */


    //Listar qual a ultima transactions de entrada / precisa de um Filter/ tem que tipar o transaction com DataListProps / encima do filter tem q fazer um .map para retornar date para pegar uma lista com numeração para pegar a maior data.

    //Math.max.apply(Math, server para pegar a maior data)

    const lastTransactions = new Date(
      Math.max.apply(Math,
        collectionFiltered
          .map((transaction: DataListProps) => new Date(transaction.date).getTime())));

    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', {
      month: 'long'
    })}`;

  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
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


    //passando a função data positive
    const lastTransactionEntries = getLastTransactionDate(transactions, "positive");

    //passando a função data negative
    const lastTransactionExpensive = getLastTransactionDate(transactions, "negative");
    //passando data do total
    const totalInterval = lastTransactionExpensive === 0
      ? 'Não há transações'
      : `01 a ${lastTransactionExpensive}`

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionEntries === 0
          ? 'Nenhuma Transação de entrada'
          : `Última entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionExpensive === 0
          ? 'Nenhuma Transação de saída'
          : `Última entrada saída ${lastTransactionExpensive}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `${totalInterval}`
      },
    });

    setIsLoading(false);
  }


  //carregar loadTransactions();
  useEffect(() => {
    loadTransactions();

    //LIMPAR LISTA DE TRANSACTION

    /* const dataKey = `@gofinances:transactions_user:${user.id}`;
    AsyncStorage.removeItem(dataKey); */

  }, []);

  //Recarregar tela
  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {

        isLoading ?
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size={'large'} />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>

                <UserInfo>
                  <Photo
                    source={{ uri: user.photo }}
                  />

                  <User>
                    <UserGreeting>Olá, </UserGreeting>
                    <UserName>{user.name} </UserName>
                  </User>

                </UserInfo>

                <LogoutButton onPress={signOut}>
                  <Icon name='power' />
                </LogoutButton>

              </UserWrapper>

            </Header>

            <HighlightCards>

              <HighlightCard
                type='up'
                title='Entradas'
                amount={highlightData?.entries?.amount}
                lastTransaction={highlightData?.entries?.lastTransaction}
              />

              <HighlightCard
                type='down'
                title='Saídas'
                amount={highlightData?.expensives?.amount}
                lastTransaction={highlightData?.expensives?.lastTransaction}
              />

              <HighlightCard
                type='total'
                title='Total'
                amount={highlightData?.total?.amount}
                lastTransaction={highlightData?.total?.lastTransaction}
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

          </>
      }
    </Container>
  );
}
