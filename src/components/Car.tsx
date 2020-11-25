import React from 'react'
import Skeleton from "react-loading-skeleton";
import { gql, useQuery, useMutation } from '@apollo/client';

function Card() {

    const GET_TODOS = gql`
{
    Todos {
        task
        id
        status
    }
}
`

    const { loading, error, data } = useQuery(GET_TODOS);


    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="main-todo-input-wrap">
                        <div className="main-todo-input fl-wrap todo-listing">

                            {
                                 Array(9)
                                .fill()
                                .map((item, index) =>  {

                                    return (
                                        <ul id="list-items" >
                                            <li>
                                                <Skeleton height={20} />
                                            </li>




                                        </ul>

                                    )
                                })
                            

                                }
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card
