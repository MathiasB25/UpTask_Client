import { useEffect } from "react"
import useProjects from "../hooks/useProjects"
import CollaboratorForm from "../components/CollaboratorForm"
import { useParams } from "react-router-dom"
import Loading from '../components/Loading'
import Alert from "../components/Alert"

const NewCollaborator = () => {

    const { getProyect, proyect, alert } = useProjects()
    const { id } = useParams()

    useEffect( () => {
        getProyect(id)
    })

    if(!proyect?._id) return <Alert alert={alert} />

    return (
        <>
            <h1 className='text-4xl font-black'>{`Añadir colaborador/a al proyecto: ${proyect.name}`}</h1>

            <div className='mt-10 flex flex-col justify-center'>
                <CollaboratorForm />
            </div>

        </>
    )
}

export default NewCollaborator