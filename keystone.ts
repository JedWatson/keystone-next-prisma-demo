import { config } from '@keystone-next/keystone/schema';
import { statelessSessions, withItemData } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';

import { extendGraphqlSchema, lists } from './schema';

let sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const auth = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      isAdmin: true,
    },
  },
});

const isAccessAllowed = ({ session }: { session?: any }) => !!session?.data?.isAdmin;

export default auth.withAuth(
  config({
    db: {
      adapter: 'prisma_postgresql',
      url: 'postgres://keystone:password@localhost:5432/keystone-next-prisma-demo',
    },
    ui: {
      isAccessAllowed,
    },
    lists,
    extendGraphqlSchema,
    session: withItemData(
      statelessSessions({
        maxAge: sessionMaxAge,
        secret: sessionSecret,
      }),
      { User: 'name isAdmin' }
    ),
  })
);
