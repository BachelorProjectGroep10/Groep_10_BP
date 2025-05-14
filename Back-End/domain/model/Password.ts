export class Password {
  readonly id?: number;          
  readonly password: string;
  readonly valid: boolean;

  constructor(data: {
    password: string;
    valid?: boolean;             
    id?: number;
  }) {
    this.id = data.id;
    this.password = data.password;
    this.valid = data.valid ?? false;
  }
}
