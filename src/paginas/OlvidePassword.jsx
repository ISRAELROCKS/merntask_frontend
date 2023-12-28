import { useState } from "react";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import { Link } from "react-router-dom";

const OlvidePassword = () => {

  const [email, setEmail]= useState('');
  const [alerta,setAlerta]= useState({});


  const handleSubmit = async e => {
    e.preventDefault()
    if(email ==='' || email.length <6 ){
      setAlerta({
        msg:'El email es obligatorio',
        error: true 
      })
      return
    } 
    try {
      const {data} = await clienteAxios.post(`/usuarios/olvide-password`,{email});
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      
    }
  }

  const {msg} = alerta
  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl capitalize">Recupera tu acceso y no pierdas tus  {''}
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

      <input 
        type="submit" 
        value='Enviar instrucciones'
        className="bg-sky-700 mb-5 w-full rounded-xl py-3 text-white uppercase font-bold hover:cursor-pointer hover:bg-sky-900 transition-colors"
        
      />

    </form>

    <nav className="lg:flex lg:justify-between">
      
      <Link
        className="block text-center my-5 text-slate-500 uppercase text-sm"
        to='/'
      >¿ ya tienes una cuenta ? Inicia sesion 
      </Link>

      <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to='/registrar'
        >¿no tienes una cuenta ? Registrate 
      </Link>
        
    </nav>
  </>
  )
}

export default OlvidePassword