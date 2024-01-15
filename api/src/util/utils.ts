export const isBlank = (text: string) =>
    text == null || text == undefined || text.trim().length == 0;

export interface ReturnObj {
    code: number;
    message: string;
    obj?: any;
    status: boolean;
}
