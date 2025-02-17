import { ChangeEvent, useContext, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import Tema from "../../../models/Tema";
import { atualizar, buscar, cadastrar } from "../../../services/Service";

function FormTema() {

    // Hook para gerenciar a navegação do usuário
    const navigate = useNavigate();

    // Váriavel de Estado que recebe os dados de um Tema
    const [tema, setTema] = useState<Tema>({} as Tema)

    // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    // Hook que pega uma variavel que foi passada pela rota do navegador - similar ao PathVariable do back
    const { id } = useParams<{ id: string }>();

    // Função que chama a service buscar() para receber os dados de um Tema especifico - usada na atualização
    async function buscarPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    // Esse useEffect verifica se quando o usuário acessou esse componente, ele tem um token válido
    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado!')
            navigate('/')
        }
    }, [token])

    // Esse useEffect verifica se existe um ID, se sim, 
    // quer dizer que estamos fazendo uma atualização e chamamos a função buscarPorId
    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id)
        }
    }, [id])

    // Função que pega os dados do Formulário e atualiza a Variavel de Estado Tema
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setTema({
            ...tema,
            [e.target.name]: e.target.value
        })
    }

    // Função que envia o usuário para a rota de listagem de temas
    function retornar() {
        navigate("/temas")
    }

    // Função que realiza o Cadastro ou Atualização de um Tema
    async function gerarNovoTema(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()  // Impede o Recarregamento do Formulário
        setIsLoading(true)  // Atualiza a Variavel de Estado, indicando que existe uma carregamento ocorrendo

        // Esse IF verifica se vamos fazer uma atualização ou cadastro de tema
        if (id !== undefined) { // Se o ID existir é um processo de atualização

            try {
                await atualizar(`/temas`, tema, setTema, {  // Chama a service de Atualizar
                    headers: { 'Authorization': token }
                })

                alert('O Tema foi atualizado com sucesso!')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    handleLogout();
                } else {
                    alert('Erro ao atualizar o tema.')
                }

            }

        } else {    // Se o ID não existir é um processo de cadastro
            try {
                await cadastrar(`/temas`, tema, setTema, { // Chama a service de Cadastrar
                    headers: { 'Authorization': token }
                })
                alert('O Tema foi cadastrado com sucesso!')

            } catch (error: any) {

                if (error.toString().includes('403')) {
                    handleLogout();
                } else {
                    alert('Erro ao cadastrar o tema.')
                }

            }
        }

        setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
        retornar()  // Chama a função retornar()
    }

    return (
        <div className="container flex flex-col items-center justify-center mx-auto">
            <h1 className="text-4xl text-center my-8">
                {id === undefined ? 'Cadastrar Tema' : 'Editar Tema'}
            </h1>

            <form className="w-1/2 flex flex-col gap-4" onSubmit={gerarNovoTema}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="descricao">Descrição do Tema</label>
                    <input
                        type="text"
                        placeholder="Descreva aqui seu tema"
                        name='descricao'
                        className="border-2 border-slate-700 rounded p-2"
                        value={tema.descricao}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <button
                    className="rounded text-slate-100 bg-indigo-400 
                               hover:bg-indigo-800 w-1/2 py-2 mx-auto flex justify-center"
                    type="submit">

                    {isLoading ?    // Se houver um carregamento, mostre um Loader

                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :

                        // Se ÑÃO houver ID, o texto que aparece é Cadastrar, senão, o texto é Atualizar
                        <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormTema;