export class Password {
  readonly id?: number;          
  readonly password: string;

  constructor(data: {
    password: string;
    id?: number;
  }) {
    this.id = data.id;
    this.password = data.password;
  }
}
