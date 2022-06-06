import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import clientAxios from "../config/clientAxios"

const NewPassword = () => {

    const [ password, setPassword ] = useState('')
    const [ validToken, setValidToken ] = useState(false)
    const { token } = useParams()
    const [ alert, setAlert ] = useState({})
    const [ passwordUpdated, setPaswordUpdated ] = useState(false)

    useEffect(() => {
        const checkToken = async () => {
            try {
                await clientAxios(`/users/reset-password/${token}`)
                setValidToken(true)
            } catch (error) {
                setAlert({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        checkToken()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        if(password.length < 6) {
            setAlert({
                msg: 'La contraseña debe tener minimo 6 caracteres',
                error: true
            })
            return
        }
        
        setAlert({})
        try {
            const { data } = await clientAxios.post(`/users/reset-password/${token}`, { password })
            setAlert({
                msg: data.msg,
                error: false
            })
            setPaswordUpdated(true)
        } catch (error) {
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
        setPassword('')
        setValidToken(false)
    }

    const { msg } = alert

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>Reestablece tu contraseña y no pierdas acceso a tus <span className='text-slate-700'>proyectos</span></h1>

            { msg && <Alert alert={alert} /> }

            { validToken && (
                <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
                    <div className='my-5'>
                        <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='password'>Nueva contraseña</label>
                        <input id='password' type="password" placeholder='Escribe tu nueva contraseña' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <input type="submit" value="Guardar nueva contraseña" className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5' />
                </form>
            )}
            {passwordUpdated && <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to='/'>Inciar sesión</Link>}
        </>
    )
}

export default NewPassword