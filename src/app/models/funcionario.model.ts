export class FuncionarioModel {
    userId: number;
    id: number;
    nome: string;
    email: string;
    token: string;
    foto: string;
    urlFoto: string;
    permissoes: Array<any>;
    perfis?: Array<any>;
}
