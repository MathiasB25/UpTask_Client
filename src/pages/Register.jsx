import clientAxios from "../config/clientAxios"
import { useState } from "react"
import { Link } from "react-router-dom"
import Alert from "../components/Alert"

const Register = () => {

    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ repeatPassword, setRepeatPassword ] = useState('')
    const [ alert, setAlert ] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()

        if([name, email, password, repeatPassword].includes('')) {
            setAlert({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        if (password.length < 6) {
            setAlert({
                msg: 'La contraseña debe tener minimo 6 caracteres',
                error: true
            })
            return
        }

        if(password != repeatPassword) {
            setAlert({
                msg: 'Las contraseñas no son iguales',
                error: true
            })
            return
        }

        setAlert({})

        try {
            const { data } = await clientAxios.post('/users', { name, email, password })
            setAlert({
                msg: data.msg,
                error: false
            })
            setName('')
            setEmail('')
            setPassword('')
            setRepeatPassword('')
        } catch (error) {
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alert

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>Crea tu cuenta y administra tus <span className='text-slate-700'>proyectos</span></h1>

            {msg && <Alert alert={alert} />}

            <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg p-10'>
                <div className='my-5'>
                    <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='name'>Nombre</label>
                    <input id='name' type="text" placeholder='Tu nombre' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className='my-5'>
                    <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='email'>Email</label>
                    <input id='email' type="email" placeholder='Email de registro' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='my-5'>
                    <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='password'>Contraseña</label>
                    <input id='password' type="password" placeholder='Contraseña de registro' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='my-5'>
                    <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='password2'>Repetir contraseña</label>
                    <input id='password2' type="password" placeholder='Repetir contraseña' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
                </div>
                <input type="submit" value="Crear cuenta" className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5' />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to='/'>¿Ya tienes una cuenta? Incia sesión</Link>
            </nav>
        </>
    )
}

export default Register