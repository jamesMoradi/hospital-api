import { Roles } from './enums/role.enum';

export interface Req extends Request {
  user?: {
    email: string;
    role: Roles;
    sub: string;
  };
}
