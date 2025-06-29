import { Request as RequestExpress } from 'express';
import { User } from '@/entities/user.entity';

export default interface AuthenticatedRequest extends RequestExpress {
  user: User;
}
