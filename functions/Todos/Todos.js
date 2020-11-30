const { ApolloServer, gql } = require('apollo-server-lambda')
// key = fnAD6OD-QyACBcMFsavYmk2L8OkTxK5zWMj2r_Y9
require("dotenv").config({
  path: `.env`,
})

var faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    Todos: [Todo!]
   
  }

  type Todo {
    id: String!
    task: String!
    status: Boolean!
  }


  type Mutation{
    addTodo(task : String!):Todo
    delTodo(id : String!):Todo
    updateTodo(id : ID! , task : String! , status : Boolean!):Todo
  }
  `
// updateTodo(task : String! , status : Boolean!):Todo
var adminClient = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KY });

const resolvers = {
  Query: {
    Todos: async () => {
      try {
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('task'))),
            q.Lambda(x => q.Get(x))
          )
        )

        return result.data.map(d => {
          // let v = d.ref;
          // let r = v.toString().split(/[, ]/).pop()
          // let s = r.slice(1, 18)
          return {
            id:d.ref.id,
            status: d.data.status,
            task: d.data.task
          }
        })
      }
      catch (err) {
        console.log("eror", err)
      }
    },

  },
  Mutation: {
    addTodo: async (_, { task }) => {

      try {
        console.log("task from forntent", task)
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                task: task,
                status: true
              }
            },
          )
        )
        return result.ref.data;

      }
      catch (err) {
        console.log("error ", err)
      }

    },
    delTodo: async (_, { id }) => {

      try {
       


         const result = await adminClient.query(
          q.Delete(q.Ref(q.Collection('todos'), id))
        )
        return result.id.toString()
      }
      catch (err) {
        console.log("error ", err)
      }

    },
    updateTodo: async (_, { id, task, status }) => {

      try {
        const result = await adminClient.query(
          q.Update(
            q.Ref(q.Collection('todos'), id),
            { data: { task: task, status: status } },
          )
        )
        return result.ref.data;

      }
      catch (err) {
        console.log("error ", err)
      }

    }
  }



}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
