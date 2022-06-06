import { useState, useEffect, createContext } from "react";
import clientAxios from '../config/clientAxios'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'

let socket

const ProjectsContext = createContext()

const ProjectsProvider = ({children}) => {

    const [ proyects, setProyects ] = useState([])
    const [ alert, setAlert ] = useState({})
    const [ proyect, setProyect ] = useState({})
    const [ formModal, setFormModal ] = useState(false)
    const [ task, setTask ] = useState({})
    const [ deleteModal, setDeleteModal ] = useState(false)
    const [ collaborator, setCollaborator ] = useState({})
    const [ collaboratorModal, setCollaboratorModal ] = useState(false)
    const [ searchModal, setSearchModal ] = useState(false)

    const navigate = useNavigate()

    const { auth } = useAuth()

    useEffect( () => {
        const getProyects = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clientAxios('/projects', config)
                setProyects(data)
            } catch (error) {
                console.log(error)
            }
        }
        getProyects()
    }, [auth])

    useEffect( () => {
        socket = io(import.meta.env.VITE_SERVER_URL)
    }, [])

    const showAlert = alert => {
        setAlert(alert)

        setTimeout(() => {
            setAlert({})
        }, 3000)
    }

    const submitProyect = async (proyect, id) => {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        if(id) {
            editProyect(id, config, proyect)
        } else {
            createProyect(config, proyect)
        }

    }

    const editProyect = async (id, config, proyect) => {
        try {
            const { data } = await clientAxios.put(`/projects/${id}`, proyect, config)
            const proyectsAct = proyects.filter(proyect => proyect._id !== id)
            setAlert({
                msg: 'Proyecto actualizado correctamente.',
                error: false
            })
            setProyects([data, ...proyectsAct])
            setProyect({})
            setTimeout(() => {
                setAlert({})
                navigate(`/projects/${id}`)
            }, 3000)
        } catch (error) {
            console.log(error)
        }
    }

    const createProyect = async (config, proyect) => {
        try {
            const { data } = await clientAxios.post('/projects', proyect, config)
            setProyects([...proyects, data])
            setAlert({
                msg: 'Proyecto creado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 3000)
        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const getProyect = async id => {
        const token = localStorage.getItem('token')
        if (!token) return
        
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clientAxios(`/projects/${id}`, config)
            setProyect(data)
        } catch (error) {
            navigate('/projects')
        }
    }

    const handleDelete = async id => {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clientAxios.delete(`/projects/${id}`, config)
            const proyectsAct = proyects.filter(proyect => proyect._id !== id)
            setProyects(proyectsAct)
            setAlert({
                msg: data.msg,
                error: true
            })
            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 3000)
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowModal = () => {
        setFormModal(!formModal)
        setTask({})
    }

    const submitTask = async (task) => {
        const id = task.taskId
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        if(id) {
            editTask(task, id, config)
        } else {
            createTask(task, config)
        }
    }

    const createTask = async (task, config) => {
        try {
            const { data } = await clientAxios.post('/tasks', task, config)
            setFormModal(false)
            // Socket.io
            socket.emit('newTask', data)
        } catch (error) {
            console.log(error.response)
        }
    }

    const editTask = async (task, id, config) => {
        try {
            const { data } = await clientAxios.put(`/tasks/${id}`, task, config)
            handleShowModal()
            
            // Socket.io
            socket.emit('editTask', data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTask = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            await clientAxios.delete(`/tasks/${task._id}`, config) 
            setDeleteModal(!deleteModal)

            // Socket.io
            socket.emit('deleteTask', task)
            setTask({})
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditTask = task => {
        setTask(task)
        setFormModal(!formModal)
    }

    const handleDeleteTask = task => {
        setTask(task)
        setDeleteModal(!deleteModal)
    }

    const submitCollaborator = async email => {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clientAxios.post('/projects/collaborators', {email}, config)
            setAlert({})
            setCollaborator(data)
        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const addCollaborator = async email => {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clientAxios.post(`/projects/collaborators/${proyect._id}`, email, config)
            showAlert({
                msg: data.msg,
                error: false
            })
            setCollaborator({})
        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleCollaborator = (collaborator) => {
        setCollaboratorModal(!collaboratorModal)
        setCollaborator(collaborator)
    }

    const deleteCollaborator = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clientAxios.post(`/projects/delete-collaborator/${proyect._id}`, { id: collaborator._id }, config)
            const updateProject = {...proyect}
            updateProject.collaborators = updateProject.collaborators.filter( collaboratorState => collaboratorState._id !== collaborator._id )
            setProyect(updateProject)
            showAlert({
                msg: data.msg,
                error: false
            })
        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCollaborator({})
            setCollaboratorModal(!collaboratorModal)
        }
    }

    const completeTask = async id => {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clientAxios.post(`/tasks/state/${id}`, {}, config)
            
            // Socket.io
            socket.emit('completeTask', data)

            setTask({})
            setAlert({})
        } catch (error) {
            console.log(error.response)
        }
    }
    
    const handleSearch = () => {
        setSearchModal(!searchModal)
    }

    // Socket.io
    const submitProjectTasks = (newTask) => {
        // Add new task to state
        const project = { ...proyect }
        project.tasks = [ ...project.tasks, newTask ]
        setProyect(project)
    }

    const socketDeleteTask = (task) => {
        const updateProject = { ...proyect }
        updateProject.tasks = updateProject.tasks.filter(taskState => taskState._id !== task._id)
        setProyect(updateProject)
    }

    const socketUpdateTask = (task) => {
        const updateProject = { ...proyect }
        updateProject.tasks = updateProject.tasks.map(taskState => taskState._id === task._id ? task : taskState)
        setProyect(updateProject)
    }

    const socketCompletedTask = (task) => {
        const updateProject = { ...proyect }
        updateProject.tasks = updateProject.tasks.map(taskState => taskState._id === task._id ? task : taskState)
        setProyect(updateProject)
    }

    const signout = () => {
        setProyects([])
        setProyect({})
        setAlert({})
    }

    return (
        <ProjectsContext.Provider value={{
            proyects,
            setProyects,
            setProyect,
            showAlert,
            alert,
            submitProyect,
            getProyect,
            proyect,
            handleDelete,
            formModal,
            handleShowModal,
            submitTask,
            handleEditTask,
            task,
            handleDeleteTask,
            deleteModal,
            deleteTask,
            submitCollaborator,
            collaborator,
            setCollaborator,
            addCollaborator,
            handleCollaborator,
            collaboratorModal,
            deleteCollaborator,
            completeTask,
            handleSearch,
            searchModal,
            submitProjectTasks,
            socketDeleteTask,
            socketUpdateTask,
            socketCompletedTask,
            signout
        }}>
            {children}
        </ProjectsContext.Provider>
    )
}

export {
    ProjectsProvider
}

export default ProjectsContext