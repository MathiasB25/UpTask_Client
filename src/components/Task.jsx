import { formatDate } from "../helpers/formatDate"
import useProjects from "../hooks/useProjects"
import useAdmin from "../hooks/useAdmin"

const Task = ({ task }) => {

    const { handleEditTask, handleDeleteTask, completeTask } = useProjects()

    const { name, description, deliverDate, priority, state, _id } = task

    const admin = useAdmin()

    return (
        <div className='border-b p-5 flex'>
            <div className='flex flex-col w-full md:flex-row md:justify-between items-start md:items-center'>
                <div>
                    <p className='mb-1 text-xl'>{name}</p>
                    <p className='mb-1 text-sm text-gray-500 uppercase'>{description}</p>
                    <p className='mb-1 text-sm'>{formatDate(deliverDate)}</p>
                    <p className='mb-1 text-gray-600'>Prioridad: {priority}</p>
                    { state && <p className='text-xs bg-green-600 uppercase p-1 rounded-lg text-white w-fit'>Completada por: {task.completed.name}</p> }
                </div>

                <div className='flex mt-3 md:flex-col lg:flex-row gap-2 h-fit'>
                    { admin && (
                        <button type='button' className='bg-indigo-600 px-2 py-2 md:px-4 md:py-3 text-white uppercase font-bold text-sm rounded-lg' onClick={() => handleEditTask(task)} >Editar</button>
                    )}
                    <button type='button' className={`${state ? 'bg-sky-600' : 'bg-gray-600'} px-2 py-2 md:px-4 md:py-3 text-white uppercase font-bold text-sm rounded-lg`} onClick={() => completeTask(_id)}>{state ? 'Completa' : 'Incompleta'}</button>
                    { admin && (
                        <button type='button' className='bg-red-600 px-2 py-2 md:px-4 md:py-3 text-white uppercase font-bold text-sm rounded-lg' onClick={() => handleDeleteTask(task)} >Eliminar</button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Task