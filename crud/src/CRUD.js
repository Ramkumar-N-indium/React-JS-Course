import React, { useEffect, useRef, useState } from 'react'
import './CRUD.css'

function CRUD() {
    const [lists, setList] = useState([])
    const [update, setUpdate] = useState(false)
    const [updateState, setUpdateState] = useState(-1)


    useEffect(() => {
        console.log('test')
        fetch('https://testdemo987.herokuapp.com/todos').then(res => {
            return res.json()
        }).then(data => {
            setList(data)
        })
    })


    return (
        <div className='crud'>
            <div>
                <AddList setList={setList} lists={lists} update={update} setUpdate={setUpdate}/>
                <form onSubmit={handleSubmit}>
                    <table>
                        {
                            lists.map((current) => {
                                    return <tr>
                                        <td>{current.name}</td>
                                        <td>{current.description}</td>
                                        <td>
                                            <button className='edit' onClick={() => handleEdit(current.id)}>Edit</button>
                                            <button className='delete' type='button' onClick={() => handleDelete(current.id)}>Delete</button>
                                        </td>
                                    </tr>
                            }
                            )
                        }
                    </table>
                </form>
            </div>
        </div>
    )

    function handleEdit(id) {
        setUpdateState(id)
    }
    function handleDelete(id) {
        const newlist = lists.filter((li) => li.id !== id)
        setList(newlist)
    }
    function handleSubmit(event) {
        event.preventDefault()
        const name = event.target.elements.name.value
        const price = event.target.elements.price.value
        const newlist = lists.map((li) => (
            li.id === updateState ? { ...li, name: name, price: price } : li
        ))

        setList(newlist)
        setUpdateState(-1)
    }
}

function EditList({ current, lists, setList }) {
    function handInputname(event) {
        const value = event.target.value;
        const newlist = lists.map((li) => (
            li.id === current.id ? { ...li, name: value } : li
        ))

        setList(newlist)
    }
    function handInputprice(event) {
        const value = event.target.value;
        const newlist = lists.map((li) => (
            li.id === current.id ? { ...li, price: value } : li
        ))

        setList(newlist)
    }
    return (
        <tr>
            <td><input type="text" onChange={handInputname} name='name' value={current.name} /></td>
            <td><input type="text" onChange={handInputprice} name='price' value={current.price} /></td>
            <td><button type='submit'>Update</button></td>
        </tr>
    )
}

function AddList({ setList, lists, update, setUpdate}) {
    const nameRef = useRef()
    const priceRef = useRef()

    function handleSubmit(event) {
        event.preventDefault();
        const name = event.target.elements.name.value;
        const description = event.target.elements.price.value;
        const newlist = {
            name,
            description
        }
        let req = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(newlist)
        }
        fetch('https://testdemo987.herokuapp.com/todos',req).then(res => {
            return res.json()
        }).then(data => {
            console.log(lists)
            lists.unshift(data)
            console.log(lists)
            setList(lists)
            setUpdate(!update)
        })

        nameRef.current.value = ""
        priceRef.current.value = ""
    }
    return (
        <form className='addForm' onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Enter Name" ref={nameRef} />
            <input type="text" name="price" placeholder="Enter Description" ref={priceRef} />
            <button type="submit">Add</button>
        </form>
    )
}

export default CRUD;