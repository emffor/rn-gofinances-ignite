import React from 'react';

import { Control, Controller } from "react-hook-form";
import { TextInputProps } from 'react-native';
import { Input } from '../Input';

import {
    Container,
    Error,
} from './styles';

interface Props extends TextInputProps {
    control: Control;
    name: string;
    error: any;
}

export function InputForm({
    control, name, error, ...rest
}: Props) {
    return (
        <Container>
            <Controller
                control={control} //o formulário q controla esse input
                render={({ field: { onChange, value } }) => (
                    <Input
                        onChangeText={onChange}
                        value={value}
                        {...rest}
                    />
                )} //qual input que eu vou renderizar q vai ser controlado.
                //sera renderizado como input controlado.
                name={name}
            />
            {/* so aparecera se tiver error / se tem error &&(entao) mostra o componente de error */}
            {
                error && <Error>{error}</Error>
            }


        </Container>
    );
}