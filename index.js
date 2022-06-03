const { ApolloServer, gql } = require("apollo-server");

const booksList = [
  {
    id: "1",
    title: "Wings Of Fire",
    category: "Autobiography",
    authorId: "1",
  },
  {
    id: "2",
    title: "India 2020",
    category: "Inspirational",
    authorId: "1",
  },
  {
    id: "3",
    title: "Mrutyunjay",
    category: "Inspirational",
    authorId: "2",
  },
];
const authorsList = [
  { id: "1", name: "Dr. APJ Abdul Kalam", age: 70 },
  { id: "2", name: "Shivaji Sawant", age: 75 },
  { id: "3", name: "Ranjit Desai", age: 50 },
];

const typeDefinations = gql`
  type Query {
    book(id: ID!): Book!
    books: [Book]
    author(id: ID!): Author
    authors: [Author]
  }

  type Mutation {
    addBook(id: ID, title: String, category: String, authorId: String): Book
  }

  type Book {
    id: ID!
    title: String!
    category: String
    author: Author
  }

  type Author {
    id: ID!
    name: String!
    age: String
    books: [Book]
  }
`;
const resolvers = {
  Query: {
    book: (_parent, args) => booksList.find((b) => b.id == args.id),
    books: () => booksList,
    author: (_parent, args) => authorsList.find((b) => b.id == args.id),
    authors: () => authorsList,
  },
  Mutation: {
    addBook: (_parent, args) => {
      const newBook = {
        id: args.id,
        category: args.category,
        title: args.title,
        author: args.author,
      };
      booksList.push(newBook);
      return newBook;
    },
  },
  Book: {
    author: (parent) => authorsList.find((a) => a.id == parent.authorId),
  },
  Author: {
    books: (parent) => booksList.filter((a) => a.authorId == parent.id),
  },
};

const server = new ApolloServer({
  typeDefs: typeDefinations,
  resolvers: resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server running at URL ${url}`);
});
