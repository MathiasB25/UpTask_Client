import useProjects from "./useProjects";
import useAuth from "./useAuth";

const useAdmin = () => {
    const { proyect } = useProjects()
    const { auth } = useAuth()

    return proyect.creator === auth._id
}

export default useAdmin