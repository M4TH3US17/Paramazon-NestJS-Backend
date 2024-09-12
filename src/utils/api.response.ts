export class Response {
    message?: string;
    data?: any;

    constructor(init?: Partial<Response>) {
        if (init) {
            this.message = init.message;
            this.data = init.data;
        }
    }
}
