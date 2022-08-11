import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { BorderlessButton } from 'react-native-gesture-handler';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';

import { DataListProps } from '.';
import React from 'react';

export const Container = styled.View`
    flex: 1px;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(42)}px;
    
    background-color: ${({theme}) => theme.colors.primary};

    justify-content: center;
    align-items: flex-start;
    flex-direction: row;

`;

export const UserWrapper = styled.View`
    width: 100%;

    padding: 0px 24px;
    margin-top: ${getStatusBarHeight() + 28}px;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;    
`;

export const Photo = styled.Image`
    width: ${RFValue(55)}px;
    height: ${RFValue(55)}px;

    border-radius: 10px;
`;

export const User = styled.View`
    margin-left: 17px;
`;

export const UserGreeting = styled.Text`
    color: ${({ theme }) => theme.colors.shape};

    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`;

export const UserName = styled.Text`
    color: ${({ theme }) => theme.colors.shape};

    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.bold};
`;

export const LogoutButton = styled(BorderlessButton)`
    
`;

export const Icon = styled(Feather)`
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${RFValue(24)}px;
`;

//.attrs acessando as prop. do Component dentro do styled components
export const HighlightCards = styled.ScrollView.attrs({
    horizontal:true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {paddingHorizontal: 24},
})`
    width: 100%;

    position: absolute;
    
    margin-top: ${RFPercentage(20)}px;
`;

export const Transactions = styled.View`
    flex: 1%;
    padding: 0px 24px;

    margin-top: ${RFPercentage(12)}px;
`;

export const Title = styled.Text`
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};

    margin-bottom: 16px;
`;

//envolvendo a Flatlist pq vou criar um typagem personalizada.
//FlatList as new () => FlatList<DataListProps> 
export const TransactionList = styled(FlatList).attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle:{
      paddingBottom:  getBottomSpace()
    }
})`` as React.ComponentType as new <DataListProps>() => FlatList<DataListProps>;