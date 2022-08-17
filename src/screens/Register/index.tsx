import React, { useState, useEffect } from 'react';

import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useForm } from "react-hook-form";

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

export function Register() {
  const dataKey = '@gofinances:transactions';

  const [transactionType, setTransactionType] = useState('');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransactionTypeSelect(type: 'up' | 'down') {
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


    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }

    try {
      //nome da aplicação + coleção das transações
      const response = await AsyncStorage.setItem(dataKey, JSON.stringify(data));
      /* console.log(response); */
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível registrar a transação');
    }
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(data!));
    }
    loadData()
  }, []);

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
                onPress={() => handleTransactionTypeSelect('up')}
                //estou fazendo comparação ai esse retorno é verdadeiro ou falso.
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton
                title='Outcome' type='down'
                onPress={() => handleTransactionTypeSelect('down')}
                isActive={transactionType === 'down'}
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