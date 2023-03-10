import { Outlet } from "react-router-dom"

const AuthLayout = () => {
    return (
        <>
            <div className="flex gap-2 justify-center bg-orange-500 py-1 text-white">
                <div><i class="fa-solid fa-triangle-exclamation text-xl"></i></div>
                <span className="uppercase font-medium font text-lg">The backend is not working</span>
                <div><i class="fa-solid fa-triangle-exclamation text-xl"></i></div>
            </div>
            <main className='container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center'>
                <div className='md:w-2/3 lg:w-2/5'>
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default AuthLayout