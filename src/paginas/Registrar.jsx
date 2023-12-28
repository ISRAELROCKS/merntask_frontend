import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";



function Registrar() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});


  const handletSubmit = async (e) => {
    e.preventDefault();
    if ([nombre, email, password, repetirPassword].includes('')) //includes incluir todos los campos son requeridos
    {
      setAlerta({
        msg: 'Todos los campos son obligatorios ',
        error: true
      });
      return;
    }
    if (password !== repetirPassword) { //si los passwors no(!==) son iguales mandar el msg
      setAlerta({
        msg: 'Los passwords no son iguales ',
        error: true
      });
      return;
    }
    if (password.length < 6) { //si el passwors es menor a 6
      setAlerta({
        msg: 'el password es muy corto, agrega minimo 6 caracteres ',
        error: true
      });
      return;
    }
    setAlerta({}); // si se cumplen todas las condiciones vuelve a ser un objeto vacio



    //crear el usuario en la api
    try {
      const { data } = await clienteAxios.post(`/usuarios`, {nombre,email,password});
      setAlerta({
        msg: data.msg,
        error: false
      });
      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      });
    }
  };

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Crea tu cuenta y administra tus {''}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form
        action=""
        className="mt-10 bg-white shadow rounded-lg px-10 p-10"
        onSubmit={handletSubmit}
      >

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="nombre"
          >Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-100 "
            value={nombre}
            onChange={e => setNombre(e.target.value)} />
        </div>

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
            onChange={e => setEmail(e.target.value)} />
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
            onChange={e => setPassword(e.target.value)} />
        </div>

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password2"
          >Repetir Password</label>
          <input
            id="password2"
            type="Password"
            placeholder="Repetir Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-100 "
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)} />
        </div>

        <input
          type="submit"
          value='Registrar'
          className="bg-sky-700 mb-5 w-full rounded-xl py-3 text-white uppercase font-bold hover:cursor-pointer hover:bg-sky-900 transition-colors" />

      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to='/'
        >¿ ya tienes una cuenta ? Inicia sesion
        </Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to='/olvide-password'
        >Olvide mi password
        </Link>
      </nav>
    </>
  );
}

export default Registrar