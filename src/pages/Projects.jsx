import useProjects from '../hooks/useProjects'
import PreviewProject from '../components/PreviewProject'

const Projects = () => {

    const { proyects } = useProjects()

    return (
        <>
            <h1 className='text-4xl font-black'>Proyectos</h1>

            <div className='bg-white shadow mt-10 rounded-lg'>
                { proyects.length ? (
                    proyects.map( proyect => (
                        <PreviewProject key={proyect._id} proyect={proyect} />
                    ))
                ) : <p className='text-center text-gray-600 uppercase font-semibold p-5'>No hay proyectos aún.</p>}
            </div>
        </>
    )
}

export default Projects