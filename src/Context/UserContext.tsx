import { User } from '@prisma/client';
import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IUserContext {
  user: User | null;
  userSetter: Dispatch<SetStateAction<User | null>> | null;
}

const UserContext = createContext<IUserContext>({
  user: null,
  userSetter: null,
});

export default UserContext;
