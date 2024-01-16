export const isBlank = (text: string) =>
    text == null || text == undefined || text.trim().length == 0;

export interface ReturnObj {
    message: string;
    obj?: any;
    success: boolean;
}
