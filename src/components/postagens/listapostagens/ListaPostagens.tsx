import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import Postagem from "../../../models/Postagem";
import { buscar } from "../../../services/Service";
import { DNA } from "react-loader-spinner";
import CardPostagens from "../cardpostagens/CardPostagens";

function ListaPostagens() {

    // Hook para gerenciar a navegação do usuário
    const navigate = useNavigate();

    // Váriavel de Estado que recebe as Postagens do back em um Array
    const [postagens, setPostagens] = useState<Postagem[]>([]);

    // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    // Função que chama a service buscar() para receber e guardar as Postagens
    async function buscarPostagens() {
        try {
            await buscar('/postagens', setPostagens, {
                headers: {
                    Authorization: token,
                },
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
            navigate('/');
        }
    }, [token])

    // Esse useEffect dispara a função de busca sempre quando o componente é renderizado
    useEffect(() => {
        buscarPostagens()
    }, [postagens.length])

    return (
        <>
            {postagens.length === 0 && ( // Se não houver temas ou estiver no momento de requisição mostre um Loader
                <DNA
                    visible={true}
                    height="200"
                    width="200"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper mx-auto"
                />
            )}
            <div className='container mx-auto my-4 
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            >
                {postagens.map((postagem) => (
                    <CardPostagens key={postagem.id} postagem={postagem} />
                ))}

            </div>
        </>
    );
}

export default ListaPostagens;