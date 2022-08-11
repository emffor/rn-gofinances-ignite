import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Button } from '../../components/Form/Button';

import { categories } from '../../utils/categories';

import {
    Container,
    Headers,
    Title,
    Category,
    Icon,
    Name,
    Separator,
    Footer,

} from './styles';


interface Category {
    key: string;
    name: string;
}

//setCategory: esperar um item, esse item vai ser a categoria. nao retorna nada por isso void.
interface Props {
    category: Category;
    setCategory: (category: Category) => void; 
    closeSelectCategory: () => void;
}

export function CategorySelect({
    category, 
    setCategory, 
    closeSelectCategory 
    } : Props){

    //o item.key aqui a comparação
    function handleCategorySelect(item: Category){
        setCategory(item);
    }

  return (
    <Container>
        <Headers>
            <Title>Categoria</Title>
        </Headers>

        <FlatList 
            data={categories}
            style={{flex: 1, width: '100%'}}
            keyExtractor={(item) => item.key}
            renderItem={({item}) => (
                <Category
                //desse jeito ele passa o item tipo a escolha 
                    onPress={() => handleCategorySelect(item)}
                    isActive={category.key === item.key} //pega o q ta armazenado dentro do estado .key 
                >
                    <Icon name={item.icon}/>
                    <Name>{item.name}</Name>
                </Category>
            )}
            ItemSeparatorComponent={() => <Separator />}
        />

        <Footer>
            <Button title='Selecionar'
                    onPress={(closeSelectCategory)}
            />
        </Footer>

    </Container>
  );
}