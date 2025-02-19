import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import Postagem from "../../../models/Postagem"
import { buscar, deletar } from "../../../services/Service"
import { RotatingLines } from "react-loader-spinner"

function DeletarPostagem() {

    // Hook para gerenciar a navegação do usuário
    const navigate = useNavigate()

    // Váriavel de Estado que recebe os dados de um Tema
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

    // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Hook que pega uma variavel que foi passada pela rota do navegador - similar ao PathVariable do back
    const { id } = useParams<{ id: string }>()

    // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    // Função que chama a service buscar() para receber os dados de uma Postagem especifica - usada na atualização
    async function buscarPorId(id: string) {
        try {
            await buscar(`/postagens/${id}`, setPostagem, {
                headers: {
                    'Authorization': token
                }
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
            alert('Você precisa estar logado')
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

    // Função que realiza a Exclusão de uma Postagem
    async function deletarPostagem() {
        setIsLoading(true)  // Atualiza a Variavel de Estado, indicando que existe uma carregamento ocorrendo

        try {
            await deletar(`/postagens/${id}`, { // Chama a service Deletar
                headers: {
                    'Authorization': token
                }
            })

            alert('Postagem apagada com sucesso')

        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            } else {
                alert('Erro ao deletar a postagem.')
            }
        }

        setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
        retornar()  // Chama a função retornar()
    }

    // Função que envia o usuário para a rota de listagem de postagem
    function retornar() {
        navigate("/postagens")
    }

    return (
        <div className='container w-1/3 mx-auto'>
            <h1 className='text-4xl text-center my-4'>Deletar Postagem</h1>

            <p className='text-center font-semibold mb-4'>
                Você tem certeza de que deseja apagar a postagem a seguir?
            </p>

            <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
                <header
                    className='py-2 px-6 bg-indigo-600 text-white font-bold text-2xl'>
                    Postagem
                </header>
                <div className="p-4">
                    <p className='text-xl h-full'>{postagem.titulo}</p>
                    <p>{postagem.texto}</p>
                </div>
                <div className="flex">
                    <button
                        className='text-slate-100 bg-red-400 hover:bg-red-600 w-full py-2'
                        onClick={retornar}>
                        Não
                    </button>
                    <button
                        className='w-full text-slate-100 bg-indigo-400 
                        hover:bg-indigo-600 flex items-center justify-center'
                        onClick={deletarPostagem}>

                        {isLoading ?    // Se houver um carregamento, mostre um Loader
                            <RotatingLines
                                strokeColor="white"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="24"
                                visible={true}
                            /> :
                            // Se NÃO um carregamento acontecendo, o texto que aparece é Sim
                            <span>Sim</span>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletarPostagem