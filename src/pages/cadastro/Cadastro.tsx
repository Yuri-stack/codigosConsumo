import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Usuario from '../../models/Usuario'
import { cadastrarUsuario } from '../../services/Service'
import './Cadastro.css'
import { RotatingLines } from 'react-loader-spinner'

function Cadastro() {

  // Hook para gerenciar a navegação do usuário
  const navigate = useNavigate()

  // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Váriavel de Estado que recebe a verificação de Senha
  const [confirmaSenha, setConfirmaSenha] = useState<string>("")

  // Váriavel de Estado que recebe os dados do usuario
  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: '',
    usuario: '',
    senha: '',
    foto: ''
  })

  // Função que quando a Variavel Usuario mudar de Estado
  // irá chamar uma função onde caso o ID de Usuário for diferente de 0
  // chamará a função retornar()
  useEffect(() => {
    if (usuario.id !== 0) {
      retornar()
    }
  }, [usuario])

  // Função que usa o Hook Navigate para enviar o usuário para a rota de Login
  function retornar() {
    navigate('/login')
  }

  // Função que pega os dados do Formulário e atualiza a Variavel de Estado Usuario
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {

    setUsuario({
      ...usuario,
      /*
        id
        nome
        senha
        usuario
        foto      
      */
      // nome : "Root"
      [e.target.name]: e.target.value
    })

  }

  // Função que pega os dados do Campo Confirmar Senha e atualiza a Variavel de Estado Confirma-Senha
  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmaSenha(e.target.value)
  }

  // Função que realiza o Cadastro do Usuário
  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()  // Impede o Recarregamento do Formulário

    // Verifica se as senhas batem e tem mais de 8 caracteres
    if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) {

      setIsLoading(true)  // Atualiza a Variavel de Estado, indicando que existe uma carregamento ocorrendo

      try { // Tenta executar uma função que pode retornar erro

        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)  // Chama a Service cadastrarUsuario
        alert('Usuário cadastrado com sucesso!')

      } catch (error: any) {
        alert('Erro ao cadastrar o usuário!')
      }

    } else {
      alert('Dados estão inconsistentes. Verifique as informações do cadastro')
      setUsuario({ ...usuario, senha: '' })
      setConfirmaSenha('')
    }

    setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen 
            place-items-center font-bold">
        <div className="fundoCadastro hidden lg:block"></div>

        <form className='flex justify-center items-center flex-col w-2/3 gap-3'
          onSubmit={cadastrarNovoUsuario}>
          <h2 className='text-slate-900 text-5xl'>Cadastrar</h2>
          <div className="flex flex-col w-full">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.nome}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuario"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.usuario}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="foto">Foto</label>
            <input
              type="text"
              id="foto"
              name="foto"
              placeholder="Foto"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.foto}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="Confirmar Senha"
              className="border-2 border-slate-700 rounded p-2"
              value={confirmaSenha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleConfirmarSenha(e)}
            />
          </div>
          <div className="flex justify-around w-full gap-8">
            <button className='rounded text-white bg-red-400 
                  hover:bg-red-700 w-1/2 py-2' onClick={retornar}>
              Cancelar
            </button>
            <button
              type='submit'
              className='rounded text-white bg-indigo-400 
                           hover:bg-indigo-900 w-1/2 py-2
                           flex justify-center'
            >
              {isLoading ?

                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
                :
                <span>Cadastrar</span>
              }

            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Cadastro