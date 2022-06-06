import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import Alert from './Alert'

const ProjectForm = () => {

    const [ name, setName ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ deliverDate, setDeliverDate ] = useState('')
    const [ client, setClient ] = useState('')

    const { id } = useParams()
    const { showAlert, alert, submitProyect, proyect } = useProjects()

    useEffect( () => {
        if(id && proyect._id) {
            setName(proyect.name)
            setDescription(proyect.description)
            setDeliverDate(proyect.deliverDate?.split('T')[0])
            setClient(proyect.client)
        }
    }, [id])

    const handleSubmit = async e => {
        e.preventDefault()

        if([name, description, deliverDate, client].includes('')) {
            showAlert({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        await submitProyect({ name, description, deliverDate, client }, id)
        setName('')
        setDescription('')
        setDeliverDate('')
        setClient('')
    }

    const { msg } = alert

    return (
        
        <>
            <form action="" className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit}>
                { msg && <Alert alert={alert} /> }
                <div className='mb-5'>
                    <label htmlFor="name" className='text-gray-700 uppercase font-bold text-sm'>Nombre proyecto</label>
                    <input type="text" className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' id='name' placeholder='Nombre del proyecto' value={name} onChange={ e => setName(e.target.value)} />
                </div>
                <div className='mb-5'>
                    <label htmlFor="desc" className='text-gray-700 uppercase font-bold text-sm'>Descripción</label>
                    <textarea rows={4} className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md resize-none' id='desc' placeholder='Descripción del proyecto' value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className='mb-5'>
                    <label htmlFor="deliver-date" className='text-gray-700 uppercase font-bold text-sm'>Fecha entrega</label>
                    <input type='date' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' id='deliver-date' value={deliverDate} onChange={e => setDeliverDate(e.target.value)} />
                </div>
                <div className='mb-5'>
                    <label htmlFor="client" className='text-gray-700 uppercase font-bold text-sm'>Nombre cliente</label>
                    <input type="text" className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' id='client' placeholder='Nombre del cliente' value={client} onChange={e => setClient(e.target.value)} />
                </div>
                <input type="submit" value={id ? 'Actualizar proyecto' : 'Crear proyecto'} className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors' />
            </form>
        </>
    )
}

export default ProjectForm