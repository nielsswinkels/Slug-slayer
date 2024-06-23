import Parse from 'parse';

export interface Session {
  id: string;
  createdAt: Date;
  date: Date;
  count: number;
  user: Parse.User;
}

// export interface Award extends Parse.Object {
//   get(name: string): any;
//   get(description: string): any;
//   get(icon: string): any;
//   get(color: string): any;
//   // id: string;
//   // name: string;
//   // description: string;
//   // icon: string;
//   // color: string;
// }

export class Award extends Parse.Object {
  constructor() {
    super('Award');
  }

  get name(): string {
    return this.get('name');
  }

  get description(): string {
    return this.get('description');
  }

  get icon(): string {
    return this.get('icon');
  }

  get color(): string {
    return this.get('color');
  }

  get color2(): string {
    return this.get('color2');
  }

  // You can also define setters if you need to update these properties
}

export interface WonAward {
  id: string;
  user: Parse.User;
  award: Award;
  year: number;
  dateReceived: Date;
}