import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import TaskList from '../TaskList'
import TaskInput from '../TaskInput'
import { Todo } from '../../@types/todo.type'
import styles from './todoList.module.scss'

interface HandleNewTodos {
  (todos: Todo[]): Todo[]
}
const syncReactToLocal = (handlerNewTodos: HandleNewTodos) => {
  const todosString = localStorage.getItem('todos')
  const todosObj: Todo[] = JSON.parse(todosString || '[]')
  const newTodosObj = handlerNewTodos(todosObj)
  localStorage.setItem('todos', JSON.stringify(newTodosObj))
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)

  const doneTodos = todos.filter((todo) => todo.done)
  const notDoneTodos = todos.filter((todo) => !todo.done)

  useEffect(() => {
    localStorage.getItem('todos')
    const todoString = localStorage.getItem('todos')
    const todoObj: Todo[] = JSON.parse(todoString || '[]')
    setTodos(todoObj)
  }, [])

  const addTodo = (name: string) => {
    const todo: Todo = {
      id: new Date().toISOString(),
      name,
      done: false,
    }

    const handler = (todosObj: Todo[]) => {
      return [...todosObj, todo]
    }

    setTodos((prev) => [...prev, todo])
    syncReactToLocal(handler)
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    const handler = (todosObj: Todo[]) => {
      return todosObj.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    }
    setTodos(handler)
    syncReactToLocal(handler)
  }

  const startEditTodo = (id: string) => {
    const findedTodo = todos.find((todo) => todo.id === id)
    if (findedTodo) {
      setCurrentTodo(findedTodo)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const finishEditTodo = () => {
    const handler = (todosObj: Todo[]) => {
      return todosObj.map((todo) => {
        if (todo.id === currentTodo?.id) {
          return currentTodo as Todo
        }
        return todo
      })
    }
    setTodos(handler)
    setCurrentTodo(null)
    syncReactToLocal(handler)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handler = (todoObj: Todo[]) => {
      const findIndexTodo = todoObj.findIndex((todo) => todo.id === id)
      if (findIndexTodo > -1) {
        const result = [...todoObj]
        result.splice(findIndexTodo, 1)
        return result
      }
      return todoObj
    }
    setTodos(handler)
    syncReactToLocal(handler)
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          todos={notDoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
