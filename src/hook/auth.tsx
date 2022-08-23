import { createContext, ReactNode, useContext, useState } from "react";
import * as AuthSession from 'expo-auth-session';
interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    //começa como objeto vazio e do tipo User.
    const [user, setUser] = useState<User>({} as User);

    async function signInWithGoogle() {
        try {
            const CLIENT_ID = '1008571702688-u4oi9iksp9nrj0h3ntaceh2t22p7dbod.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@eloanmf/gofinances';
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email'); //troca o espaço por uma combinação de %20

            //endpoint para autenticação do google
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;


            const { type, params } = await AuthSession
                .startAsync({ authUrl }) as AuthorizationResponse;

            //buscando os dados do usuário
            if (type === 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${params.access_token}`);
                const userInfo = await response.json();
                /* console.log(userInfo); */

                //informando o usuário do usuário passando para o states
                setUser({
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                });
            }

        } catch (error) {
            throw new Error('Play services not available');
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}


export { AuthProvider, useAuth };