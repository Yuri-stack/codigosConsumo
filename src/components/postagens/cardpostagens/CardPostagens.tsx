﻿import { Link } from 'react-router-dom'
import Postagem from '../../../models/Postagem'
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

interface CardPostagensProps {
    postagem: Postagem // Indicamos que a prop postagem é um Objeto (do Tipo/da Model) Postagem
}

function CardPostagem({ postagem }: CardPostagensProps) {   // Passamos a props postagem para o card

    const { usuario } = useContext(AuthContext);


    return (
        <div className='border-slate-900 border 
            flex flex-col rounded overflow-hidden justify-between'>

            <div>
                <div className="flex w-full bg-indigo-400 py-2 px-4 items-center gap-4">
                    <img
                        src={postagem.usuario?.foto}
                        className='h-12 rounded-full'
                        alt={postagem.usuario?.nome} />
                    <h3 className='text-lg font-bold text-center uppercase'>
                        {postagem.usuario?.nome}
                    </h3>
                </div>
                <div className='p-4 '>
                    <h4 className='text-lg font-semibold uppercase'>{postagem.titulo}</h4>
                    <p>{postagem.texto}</p>
                    <p>Tema: {postagem.tema?.descricao}</p>
                    <p>Data: {new Intl.DateTimeFormat(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'medium',
                    }).format(new Date(postagem.data))}</p>
                </div>
            </div>

            {
                postagem.usuario?.id === usuario.id &&
                (
                    <div className="flex">
                        <Link to={`/editarpostagem/${postagem.id}`}
                            className='w-full text-white bg-indigo-400 
                        hover:bg-indigo-800 flex items-center justify-center py-2'>
                            <button>Editar</button>
                        </Link>
                        <Link to={`/deletarpostagem/${postagem.id}`}
                            className='text-white bg-red-400 
                        hover:bg-red-700 w-full flex items-center justify-center'>
                            <button>Deletar</button>
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default CardPostagem 