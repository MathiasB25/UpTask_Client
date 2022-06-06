import { useState } from "react"
import useProjects from "../hooks/useProjects"
import Alert from "./Alert"
import Loading from "./Loading"

const CollaboratorForm = () => {

    const [ email, setEmail ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const { showAlert, alert, submitCollaborator, collaborator, setCollaborator, addCollaborator } = useProjects()

    const handleSubmit = async e => {
        e.preventDefault()

        setCollaborator({})
        if(email === '') {
            showAlert({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        setLoading(true)
        await submitCollaborator(email)
        setLoading(false)
    }

    const { msg } = alert

    return (
        <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow mx-auto' onSubmit={handleSubmit}>
            { msg && <Alert alert={alert} /> }
            <div className='mb-5'>
                <label htmlFor="email" className='text-gray-700 uppercase font-bold text-sm'>Email colaborador</label>
                <input type="email" id='email' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder='Email del colaborador' value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <input type="submit" value='Buscar colaborador' className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm' />
            {loading ? <div className='mt-6'><Loading /></div> : collaborator?._id && (
                <>
                    <div className='flex justify-between items-center px-4 py-2 bg-slate-200 rounded-lg mt-6'>
                        <p className='font-semibold'>{collaborator.name}</p>
                        <button type='button' className='bg-slate-500 px-4 p-2 rounded-lg text-white font-semibold text-sm flex gap-2' onClick={() => addCollaborator({ email: collaborator.email })}>
                            Agregar
                        </button>
                    </div>
                </>
            )}
        </form>
    )
}

export default CollaboratorForm