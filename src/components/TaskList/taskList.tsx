import PropTypes from 'prop-types'

import { Todo } from '../../@types/todo.type'
import styles from './taskList.module.scss'

interface taskListProps {
  doneTaskList?: boolean
  todos: Todo[]
  handleDoneTodo: (id: string, done: boolean) => void
  startEditTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

export default function TaskList(props: taskListProps) {
  const { doneTaskList, todos, handleDoneTodo, startEditTodo, deleteTodo } = props

  //đang sài crying => cho nó trả về 1 function(để tránh react khi render lần đầu sẽ callback) -> cách nâng cao
  const onChangeCheckbox = (idTodo: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDoneTodo(idTodo, event.target.checked)
  }

  return (
    <div className='mb-2'>
      <h2 className={styles.title}>{doneTaskList ? `Hoàn thành` : `Chưa hoàn thành`}</h2>
      <div className={styles.tasks}>
        {todos.map((todo) => (
          <div className={styles.task} key={todo.id}>
            <input
              type='checkbox'
              className={styles.taskCheckbox}
              checked={todo.done}
              onChange={onChangeCheckbox(todo.id)}
            />
            <span className={`${styles.taskName} ${todo.done ? styles.taskNameDone : ''}`}>{todo.name}</span>
            <div className={styles.taskActions}>
              {/* đây là cách truyền hàm và có tham số cách khác với crying  */}
              <button className={styles.taskBtn} onClick={() => startEditTodo(todo.id)}>
                🖋️
              </button>
              <button className={styles.taskBtn} onClick={() => deleteTodo(todo.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
TaskList.protoType = {
  doneTaskList: PropTypes.bool,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired,
    })
  ).isRequired,
  handleDoneTodo: PropTypes.func.isRequired,
  startEditTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
}
