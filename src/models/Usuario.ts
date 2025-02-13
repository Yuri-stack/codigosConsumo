import Postagem from "./Postagem";

export default interface Usuario {
    id: number;
    nome: string;
    usuario: string;
    senha: string;
    foto: string;
    postagem?: Postagem | null; // || => ou
}

// Tipar objetos

let user: Usuario = {
    id: 1,
    nome: "Gustavo",
    usuario: "gustavo@gustavo.com",
    senha: "futebol",
    foto: "",
    postagem: null
}