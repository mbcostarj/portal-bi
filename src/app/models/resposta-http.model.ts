export interface RespostaHttp {
    success: boolean;
    informations: Array<string>;
    errors: Array<string>;
    data: object;
}