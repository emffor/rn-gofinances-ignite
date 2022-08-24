import React, { useState, useEffect } from 'react';

import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useForm } from "react-hook-form";

import uuid from 'react-native-uuid';

import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles';

//importando tudo com q tem dentro de Yup // Validação
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../hook/auth';

interface FormData {
  [name: string]: any;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('informe um valor numérico')
    .positive('O valor não pode ser Negativo.')
    .required('O valor é obrigatório')
})

//Tipar Rota de Navegação bottom-tabs
type NavigationProps = {
  navigate: (screen: string) => void;
}

export function Register() {
  const { user } = useAuth();

  const dataKey = `@gofinances:transactions_user:${user.id}`;

  const [transactionType, setTransactionType] = useState('');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const navigation = useNavigation<NavigationProps>();

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  const {
    control,
    handleSubmit,
    reset,//reset formulário
    formState: { errors } //desestruturando error do FormState
  } = useForm({
    //força q o valor do formulário siga um padrão.
    resolver: yupResolver(schema)
  });

  async function handleRegister(form: FormData) {

    //! significa se nao tiver nada !transactionType
    if (!transactionType)
      return Alert.alert('Selecione o tipo da transação');

    if (category.key === 'category')
      return Alert.alert('Selecione a categoria');


    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    //Com setItem sempre sobrescreve

    try {
      //nome da aplicação + coleção das transações
      const data = await AsyncStorage.getItem(dataKey);

      //tem alguma coisa em data? se tiver já devolve o data se nao um array [];
      const currentData = data ? JSON.parse(data) : [];

      //adiciona a nova transação no array de transações + as que já estavam lá
      const dataFormatted = [
        ...currentData,
        newTransaction
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      //reset states
      reset(); //do useForm yup
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      })

      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível registrar a transação');
    }
  }

  //LISTAR dataKey

  /*   useEffect(() => {
      async function loadData() {
        const data = await AsyncStorage.getItem(dataKey);
        console.log(JSON.parse(data!));
      }
      loadData()
    }, []); */


  //APAGAR asyncStorage

  /*   useEffect(() => {
      async function removeAll() {
        await AsyncStorage.removeItem(dataKey);
      }
      removeAll()
    }, []); */

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Container>

        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name='name'
              control={control} //como q ele vai identificar
              placeholder="Nome"
              placeholderTextColor={'#999'}
              autoCapitalize='sentences' //primeira letra maiúscula
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name='amount'
              control={control} //como q ele vai identificar
              placeholder="Preço"
              placeholderTextColor={'#999'}
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                title='Income' type='up'
                onPress={() => handleTransactionTypeSelect('positive')}
                //estou fazendo comparação ai esse retorno é verdadeiro ou falso.
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                title='Outcome' type='down'
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionsTypes>

            {/* seleção da categoria */}
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />

          </Fields>

          <Button
            title='Enviar'
            onPress={handleSubmit(handleRegister)}
          // onPress={handleRegister}
          />

          {/* visible={false} */}
          <Modal visible={categoryModalOpen}>

            <CategorySelect
              category={category} //o estado passando pro modal 
              setCategory={setCategory} //função q atualiza o estado
              closeSelectCategory={handleCloseSelectCategoryModal}
            />

          </Modal>
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
}