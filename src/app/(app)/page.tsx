'use client'

import { Todo } from '@/payload-types'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch('/api/todos')
        const todoData = await response.json()
        setTodos(todoData.docs)
      } catch (error) {}
    }
    getTodos()
  }, [])

  const handleTodoStatus = async (todo: Todo) => {
    try {
      const req = await fetch(`/api/todos/${todo?.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo?.completed,
        }),
      })
      const data = await req.json()
      console.log(data)
      const newTodos = todos?.map((currTodo) => {
        if (currTodo.id === data.doc.id) {
          currTodo.completed = data?.doc?.completed
        }
        return currTodo
      })
      setTodos(newTodos)
    } catch (err) {
      console.log(err)
    }
  }

  const handleTodoEdit = (todo: Todo) => {}

  const handleCreateNewTodo = async () => {
    try {
      const req = await fetch('/api/todos', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newTodo,
        }),
      })
      const data = await req.json()
      console.log(data)
      setTodos((prevTodos) => [...prevTodos, data.doc])
      setNewTodo('')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <React.Fragment>
      <div>Todos</div>
      <input type="todo" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
      <button type="button" onClick={handleCreateNewTodo}>
        Create new todo
      </button>
      {todos?.map((todo) => {
        return (
          <div key={todo.id}>
            <input
              type="checkbox"
              checked={todo?.completed!}
              onChange={() => handleTodoStatus(todo)}
            />
            <span onClick={() => handleTodoEdit(todo)} id="todo">
              {todo?.task}
            </span>
          </div>
        )
      })}
    </React.Fragment>
  )
}

export default page
