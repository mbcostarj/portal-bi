export class RenovarToken {
    usuario: string;
    codigoSistema: string = 'SISPBI';

    constructor(usuario: string){
        if (usuario) {
            this.usuario = usuario;
        }
    }
}