import { FormEvent, useState } from 'react';
import { FiTrash, FiCheckSquare } from 'react-icons/fi'
import { toast } from 'react-toastify';
import { Task } from '../types'

import '../styles/tasklist.scss';

export function TaskList() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storagedCart = localStorage.getItem('@ToDo:tasks');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });


  function handleCreateNewTask(event:FormEvent){
    event.preventDefault();
    
    try {
      if(!newTaskTitle){
        alert('A descrição da tarefa esta vazia.');
        return;
      }
      const lastItem = tasks[ tasks.length - 1 ];

      const data = {
        id: lastItem ? lastItem.id + 1 : 0,
        title: newTaskTitle,
        isComplete: false
      }
      const newTask = [...tasks, {...data}];
      setTasks(newTask);
      localStorage.setItem('@ToDo:tasks', JSON.stringify(newTask));        

      setNewTaskTitle('')
      return toast.success('Tarefa adicionada');
      
    } catch{
      toast.error('Erro ao adicionar nova tarefa');
    }
  }

  function handleToggleTaskCompletion(taskId: number){
    const taskChanged = tasks.map(task => task.id === taskId ? {
      ...task,
      isComplete: !task.isComplete,
    }: task)

    setTasks(taskChanged); 
    localStorage.setItem('@ToDo:tasks', JSON.stringify(taskChanged));
  }

  function handleRemoveTask(taskId: number){
    const filterTask = tasks.filter(task => task.id !== taskId)
    setTasks(filterTask);
    localStorage.setItem('@ToDo:tasks', JSON.stringify(filterTask));   
  }


  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <form className="input-group" onSubmit={handleCreateNewTask}>
          <input 
            type="text" 
            placeholder="Adicionar nova tarefa" 
            onChange={(event) => setNewTaskTitle(event.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button">
            <FiCheckSquare size={16} color="#fff"/>
          </button>
        </form>
      </header>

      <main>
        <ul>
          {/* {[{  id: 1, title: 'teste',isComplete: false,}, {  id: 2, title: 'teste02',isComplete: true,}].map(task => ( */}
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input 
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16}/>
              </button>
            </li>
          ))}
          
        </ul>
      </main>
    </section>
  )
}