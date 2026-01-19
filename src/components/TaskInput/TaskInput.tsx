import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Todo } from '../../@types/todo.type'
import styles from './taskInput.module.scss'

interface TaskInputProps {
  addTodo: (name: string) => void
  currentTodo: Todo | null
  editTodo: (name: string) => void
  finishEditTodo: () => void
}

export default function TaskInput(props: TaskInputProps) {
  const { addTodo, currentTodo, editTodo, finishEditTodo } = props
  const [name, setName] = useState<string>('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentTodo) {
      finishEditTodo()
      if (name) {
        setName('')
      }
    } else {
      addTodo(name)
      setName('')
    }
  }
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (currentTodo) {
      editTodo(value)
    } else {
      setName(value)
    }
  }
  return (
    <div className='mb-2'>
      <h1 className={styles.title}> To do list typesciprt</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Caption goes here'
          value={currentTodo ? currentTodo.name : name}
          onChange={onChangeInput}
        />
        <button type='submit'>{currentTodo ? '✔️' : '➕'}</button>
      </form>
    </div>
  )
}

TaskInput.protoTypes = {
  addTodo: PropTypes.func.isRequired,
  currentTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
  finishEditTodo: PropTypes.oneOf([
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired,
    }),
    null,
  ]),
}
