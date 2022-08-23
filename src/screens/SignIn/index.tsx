import React, { useState } from "react";
import { ActivityIndicator, Platform, Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { SignInSocialButton } from "../../components/SignInSocialButton";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";

import { useAuth } from "../../hook/auth";

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from "./styles";

export function SignIn() {
    const { signInWithGoogle } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();

    async function handleSignInWithGoogle() {
        try {
            await signInWithGoogle();

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível fazer o login com o Google");
        }
    }

    async function handleSignInWithApple() { }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg width={RFValue(120)} height={RFValue(68)} />

                    <Title>
                        Controle suas{"\n"}finanças de forma{"\n"}muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>Faça seu login com{"\n"}uma das contas abaixo</SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com o Google"
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />
                    {Platform.OS === "ios" && (
                        <SignInSocialButton
                            title="Entrar com a Apple"
                            svg={AppleSvg}
                            onPress={handleSignInWithApple}
                        />
                    )}
                </FooterWrapper>

                {isLoading && (
                    <ActivityIndicator
                        color={theme.colors.shape}
                        style={{
                            marginTop: 18,
                        }}
                    />
                )}
            </Footer>
        </Container>
    );
}