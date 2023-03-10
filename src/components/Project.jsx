import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import useAdmin from '../hooks/useAdmin'
import TaskModal from "./TaskModal"
import TaskDeleteModal from "./TaskDeleteModal"
import Task from "./Task"
import Collaborator from "./Collaborator"
import CollaboratorModal from "./CollaboratorModal"
import Loading from '../components/Loading'
import io from 'socket.io-client'

let socket

const Project = () => {

    const [ loading, setLoading ] = useState(true)

    const { id } = useParams()
    const { getProyect, proyect, handleShowModal, submitProjectTasks, socketDeleteTask, socketUpdateTask, socketCompletedTask } = useProjects()

    const admin = useAdmin()

    const { name } = proyect

    useEffect( () => {
        const onLoad = async () => {
            await getProyect(id)
            setLoading(false)
        }
        onLoad()
    }, [])

    useEffect( () => {
        socket = io(import.meta.env.VITE_SERVER_URL)
        socket.emit('openProject', id)
    }, [])

    useEffect( () => {
        socket.on('addTask', (task) => {
            if (task.project._id === proyect._id) {
                submitProjectTasks(task)
            }
        })

        socket.on('deletedTask', (task) => {
            if (task.project._id === proyect._id) {
                socketDeleteTask(task)
            }
        })

        socket.on('updatedTask', (task) => {
            if (task.project._id === proyect._id) {
                socketUpdateTask(task)
            }
        })

        socket.on('completedTask', (task) => {
            if (task.project._id === proyect._id) {
                socketCompletedTask(task)
            }
        })
    })

    return (
        loading ? <Loading /> : (
            <>
                <div className='flex justify-between'>
                    <h1 className='font-black text-3xl'>{name}</h1>

                    { admin && (
                        <div className='flex items-center'>
                            <Link to={`/projects/edit/${id}`} className='flex items-center gap-2 text-gray-400 hover:text-black uppercase font-bold transition-colors'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Editar
                            </Link>
                        </div>
                    )}
                </div>

                { admin && (
                    <button onClick={() => handleShowModal(true)} type='button' className='flex gap-2 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold text-white text-center mt-5 bg-sky-400 hover:bg-sky-500 transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Nueva tarea
                    </button>
                )}

                <p className='font-bold text-xl mt-10'>Tareas del proyecto</p>

                <div className='bg-white shadow mt-10 rounded-lg'>
                    { proyect.tasks?.length ? proyect.tasks?.map( task => (
                        <Task key={task._id} task={task} />
                    )) :  <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
                </div>

                {admin && (
                    <>                    
                        <div className='flex justify-between items-center mt-10'>
                            <p className='font-bold text-xl'>Colaboradores</p>
                            <div>
                                <Link to={`/projects/new-collaborator/${id}`} className='flex items-center gap-2 text-gray-400 hover:text-black uppercase font-bold transition-colors'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    Añadir
                                </Link>
                            </div>
                        </div>

                        <div className='bg-white shadow mt-10 rounded-lg'>
                            {proyect.collaborators?.length ? proyect.collaborators?.map(collaborator => (
                                <Collaborator key={collaborator._id} collaborator={collaborator} />
                            )) : <p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>}
                        </div>
                    </>
                )}

                <TaskModal />
                <TaskDeleteModal />
                <CollaboratorModal />
            </>
        )
    )
}

export default Project