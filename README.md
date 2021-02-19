# keystone-next-prisma-demo

This is the source for the demo I did on [Prisma's live stream](https://twitter.com/nikolasburk/status/1362717932078383109?s=20), Feb 18th 2021.

It needs docs, but not as much as I need some sleep 🙂

tl;dr on getting started is:

- Clone this repo
- Make sure you have a local Postgres database ready to go
- Put your connection string in `./keystone.ts` around like 28
- Run `yarn` in the root to install the dependencies

Then you can start Keystone with the scripts defined in `package.json`.

The one you want is most likely `yarn prototype` which will start the project with Prisma in prototype mode. See the [CLI Docs for Keystone Next](https://next.keystonejs.com/guides/cli) for more details.

Once it's started, Keystone will be running at [localhost:3000](http://localhost:3000) and you'll be prompted to create a user for your local database.

If anything goes wrong, open an issue here and I'll try to respond!

---

MIT License, Copyright (c) 2021 Jed Watson
