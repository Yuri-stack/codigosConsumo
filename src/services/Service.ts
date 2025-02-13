import axios from "axios";

const api = axios.create({
    baseURL: 'https://blog-render-back.onrender.com'
})

export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}

// resposta = {
//     config,
//     data: {
//         ...usuario
//     }
// }

// export async function cadastrarU(url: string, dados: Object, setDados: Function) {
//     const resposta = await api.post(url, dados) //usuario/cadastrar -> { nome, senha, email, ...}
//     setDados(resposta.data)
// }

export const login = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}