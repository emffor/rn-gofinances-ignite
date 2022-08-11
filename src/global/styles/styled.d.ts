import 'styled-components';
import theme from './theme';

//tou criando um tipo que eu dei esse nome pra ele, e tou dizendo que ele é igual, e o typeof(é um recurso q copia exatamente qual é o tipo de um objeto). 
declare module 'styled-components' { 
    type ThemeType = typeof theme

    export interface DefaultTheme extends ThemeType {}
}