import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"//autentica la usuario
import useAuth from "../hooks/useAuth"

const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [alerta,setAlerta] = useState({});

  const {setAuth} = useAuth();

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

     if( [email,password].includes('')){
      setAlerta({
        msg:'Todos los campos son obligatorios',
        error: true
      })
      return
     }
     try {
      const {data} = await clienteAxios.post('/usuarios/login', {email, password})
      setAlerta({})
      localStorage.setItem('token', data.token)
      setAuth(data)
      navigate('/proyectos')

     } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
     }
  }

  const {msg} = alerta; //extraemos el mensaje de alerta
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesion y administra tus {''}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta}/>}
      <form 
        className="mt-10 bg-white shadow rounded-lg px-10 p-10"
        onSubmit={handleSubmit}
      
      >
        <div className="my-5">
          <label 
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="E-mail de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-100 "
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label 
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password"
          >Password</label>
          <input
            id="password"
            type="Password"
            placeholder="Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-100 "
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <input 
          type="submit" 
          value='Iniciar sesion'
          className="bg-sky-700 mb-5 w-full rounded-xl py-3 text-white uppercase font-bold hover:cursor-pointer hover:bg-sky-900 transition-colors"
        />

      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to='/registrar'
        >¿no tienes una cuenta ? Registrate </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to='/olvide-password'
        >Olvide mi password </Link>

      </nav>
    </>
  )
}

export default Login