export class Password {
  readonly id?: number;
  readonly password: { value: string }[];

  constructor(data: {
    password: { value: string }[];
    id?: number;
  }) {
    this.id = data.id;
    this.password = data.password;
  }
}
