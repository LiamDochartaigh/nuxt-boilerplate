import { UserType } from './models/userModel';

declare module 'h3' {
  interface H3EventContext {
    user?: UserType;
  }
}