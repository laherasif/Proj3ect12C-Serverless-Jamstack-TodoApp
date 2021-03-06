import React, { useState, useEffect } from "react"
import { gql, useQuery, useMutation } from '@apollo/client';
import './index.css'
import Card from "../components/Car";
import Skeleton from "react-loading-skeleton";

// import 'bootstrap/dist/css/bootstrap.min.css'
const GET_TODOS = gql`
{
    Todos {
        task
        id
        status
    }
}
`

const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`

const DELETE_TODO = gql`
mutation delTodo($id: String!) {
  delTodo(id: $id) {
    task
  }
}`;



export default function Home() {
    const { loading, error, data } = useQuery(GET_TODOS);

    const [Loading , setLoading] = useState(false)
    useEffect(()=>{
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    },[data ? Loading : null])
    
    let inputText;

    const [addTodo ] = useMutation(ADD_TODO);

    const addTask = () => {
        addTodo({
            variables: {
                task: inputText.value
            },
            refetchQueries: [{ query: GET_TODOS }]
        })
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000);
        inputText.value = "";
    }

    const [delTodo] = useMutation(DELETE_TODO)
    const deleteTask = id => {
        delTodo({
            variables: { id: id },
            refetchQueries: [{ query: GET_TODOS }]
        })

        setLoading(true)

    }


  


 


console.log("sate" , Loading)

    return (
        <>

            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-todo-input-wrap">
                            <div className="main-todo-input fl-wrap">
                                <div className="main-todo-input-item">
                                    <input type="text" className="form-control" id="todo-list-item" ref={node => {
                                        inputText = node;
                                    }} placeholder="What will you do today?" />
                                </div>
                                <button className="add-items main-search-button"  onClick={addTask}>ADD</button>
                            </div>
                        </div>
                    </div>
                </div>
                {loading && <Card />}
               
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-todo-input-wrap">
                            <div className="main-todo-input fl-wrap todo-listing">
                                { Loading
                                
                                ?  
                                  data.Todos.map((item , index) => {
                                      return (
                                        <ul id="list-items" key={index} >
                                            
                                            
                                            <li>
                                                <Skeleton height={20}/>
                                            </li>

                                        </ul>
                                      )
                                      }) 

                                :
                                

                                !loading && data ? data.Todos.map((todo) => {

                                    return (
                                        <ul id="list-items" key={todo.id} >
                                            
                                            
                                            <li>{todo.task}
                                                <button className="delet-btn" onClick={() => deleteTask(todo.id)}
                                                    style={{ float: 'right' }}>X</button>
                                            </li>
                                       
                                


                                        </ul>

                                    )
                                })
                                : null

                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display:'flex' , justifyContent:'center' , color:'red'}}>
                { error ? <h2>Error : Please Check your internet connection</h2> : null }

                </div>
            
        </div>
        </>

        // <div className="container">
        //     <label>
        //         <h1> Add Task </h1>
        //         <input type="text" ref={node => {
        //             inputText = node;
        //         }} />
        //     </label>
        //     <button onClick={addTask}>Add Task</button>

        //     <br /> <br />

        //     <h3>My TODO LIST</h3>

        //     <table border="2">
        //         <thead>
        //             <tr>
        //                 <th>ID</th>
        //                 <th> TASK </th>
        //                 <th> STATUS </th>
        //                 <th> EDIT </th>
        //                 <th> DELETE </th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {data ? data.Todos.map(todo => {

        //                 console.log("todos" , todo)
        //                 return <tr>

        //                     <td> {todo.id} </td>
        //                     <td> {todo.task} </td>
        //                     <td> {todo.status.toString()} </td>
        //                     <td><button style={{ color: 'blue' }}> Edit</button></td>
        //                     <td><button style={{ color: 'red' }} onClick={()=> deleteTask(todo.id)}> Delete</button></td>
        //                 </tr>
        //             }
        //             )
        //             : null
        //         }
        //         </tbody>
        //     </table>

        // </div>
    );

}
