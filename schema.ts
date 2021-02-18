import { createSchema, gql, graphQLSchemaExtension, list } from '@keystone-next/keystone/schema';
import {
  checkbox,
  password,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-next/fields';
import { document } from '@keystone-next/fields-document';

import { KeystoneListsAPI } from '@keystone-next/types';
import { componentBlocks } from './fields/Content';

const randomNumber = () => Math.round(Math.random() * 10);

const permissions = {
  isAdmin: ({ session }: any) => !!session?.data?.isAdmin,
};
const rules = {
  listAccess: {
    create: permissions.isAdmin,
    read: permissions.isAdmin,
    update: permissions.isAdmin,
    delete: permissions.isAdmin,
  },
};

const layouts = [
  [1, 1],
  [1, 1, 1],
  [2, 1],
  [1, 2],
  [1, 2, 1],
] as const;

const User = list({
  access: rules.listAccess,
  ui: {
    listView: {
      initialColumns: ['name', 'isAdmin', 'posts'],
    },
  },
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    isAdmin: checkbox({ defaultValue: false }),
    posts: relationship({ ref: 'Post.author', many: true }),
    randomNumber: virtual({
      graphQLReturnType: 'Float',
      resolver() {
        return randomNumber();
      },
    }),
  },
});

export const Post = list({
  access: rules.listAccess,
  ui: {
    listView: {
      initialColumns: ['title', 'slug', 'status'],
    },
  },
  fields: {
    title: text(),
    slug: text(),
    status: select({
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    publishedAt: timestamp(),
    content: document({
      ui: { views: require.resolve('./fields/Content.tsx') },
      formatting: true,
      layouts,
      links: true,
      dividers: true,
      componentBlocks,
    }),
    author: relationship({
      ref: 'User.posts',
      ui: {
        displayMode: 'cards',
        cardFields: ['name', 'email'],
        inlineEdit: { fields: ['name', 'email'] },
        linkToItem: true,
        inlineCreate: { fields: ['name', 'email'] },
        inlineConnect: true,
      },
    }),
  },
});

export const lists = createSchema({
  User,
  Post,
});

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: gql`
    type Query {
      randomNumber: RandomNumber
    }
    type RandomNumber {
      number: Int
      generatedAt: Int
    }
    type Mutation {
      createRandomPosts: [Post!]!
    }
  `,
  resolvers: {
    RandomNumber: {
      number(rootVal: { number: number }) {
        return rootVal.number * 1000;
      },
    },
    Mutation: {
      createRandomPosts(root, args, context) {
        const lists: KeystoneListsAPI<any> = context.lists;
        const data = Array.from({ length: 238 }).map((x, i) => ({
          data: { title: `Post ${i}` },
        }));
        return lists.Post.createMany({ data });
      },
    },
    Query: {
      randomNumber: () => ({
        number: randomNumber(),
        generatedAt: Date.now(),
      }),
    },
  },
});
