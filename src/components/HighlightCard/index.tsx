import React from 'react';

import { 
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
 } from './styles';

 interface Props {
   title: string;
   amount: string;
   lastTransaction: string;
   //usando opções no recurso do TypeScript
   type: 'up' | 'down' | 'total';
 }

 //esse objeto serve pra auxiliar o item do type
 const icon = {
   up: 'arrow-up-circle',
   down: 'arrow-down-circle',
   total: 'dollar-sign'
 }

export function HighlightCard({ 
    type,
    title, 
    amount, 
    lastTransaction 
}: Props){
  return (
    <Container type={type}>
       <Header>
         <Title type={type}>{title}</Title>
         {/* 
            acessando o tipo do cartao com o objeto auxiliar 
            o type criado depois é para acessar pelo styled components
         */}
         <Icon name={icon[type]} type={type}/>

       </Header>

       <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>

    </Container>
  );
}