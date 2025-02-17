import { ReactNode, createContext, useState } from "react";
import UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";

// Interface que indica a Tipagem dos dados guardados no Contexto
interface AuthContextProps {
    usuario: UsuarioLogin
    handleLogout(): void
    handleLogin(usuario: UsuarioLogin): Promise<void>
    isLoading: boolean
}

// Interface que indica a Tipagem do Provedor de Contexto - Função que armazena e gerencia os dados do Contexto
interface AuthProvidersProps {
    children: ReactNode // Indica que o Contexto que possui um elemento React dentro de sua abertura é fechamento
}

// Criamos o Contexto e iniciamos ele com um objeto vazio
export const AuthContext = createContext({} as AuthContextProps)

// Criamos a função Provider/Provedor, que armazena e gerencia os dados do Contexto
export function AuthProvider({ children }: AuthProvidersProps) {

    // Função que pega os dados do Formulário e atualiza a Variavel de Estado Usuario
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: '',
        usuario: '',
        senha: '',
        foto: '',
        token: ''
    })

    // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
    const [isLoading, setIsLoading] = useState(false)

    // Função que é responsavel por Logar o usuário
    async function handleLogin(usuarioLogin: UsuarioLogin) {
        setIsLoading(true)

        try {
            await login(`/usuarios/logar`, usuarioLogin, setUsuario)    // Chama a Service login
            alert("O Usuário foi autenticado com sucesso!")
        } catch (error) {
            console.log(error)
            alert("Os dados do Usuário estão inconsistentes!")
        }

        setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou

    }

    // Função que reseta os campos da variavel de estado, limpando o Token, e deslogando o usuário
    function handleLogout() {
        setUsuario({
            id: 0,
            nome: '',
            usuario: '',
            senha: '',
            foto: '',
            token: ''
        })
    }

    return (
        // Montamos o retorno do Provider/Provedor de Contexto, passando os dados que ele compartilha
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}