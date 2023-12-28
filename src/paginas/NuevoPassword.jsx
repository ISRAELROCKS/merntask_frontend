import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";


const NuevoPassword = () => {
  const [password,setPassword] = useState('');
  const[tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [passwordModificado,setPasswordModificado]= useState(false);

  const params = useParams()//TODO: USEPARAMS LEE DATOS DE LA URL 
  const {token} = params 

  useEffect(() =>{ 
    const comprobarToken = async() =>{
      try {
        // TODO: MOVER HACIA UN CLIENTE AXIOS
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg ,
          error: true
        })
        
      }
    }
    comprobarToken()

  },[])

  const handleSubmit = async e => {
    e.preventDefault();

    if(password <6 ){
      setAlerta({
        msg: 'El password debe ser minimo de 6 caracteres',
        error: true 
      })
      return 
    }
    try {
      const url = `/usuarios/olvide-password/${token}`

      const {data} = await clienteAxios.post(url,{password})
      setAlerta({
        msg: data.msg,
        error:false
      })
      setPasswordModificado(true)
    } catch (error) {
      setAlerta({
        msg:error.reponse.data.msg,
        error:true
      })
    }

  };
  const {msg} = alerta 

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Restablece tu password y no pierdas acceso a tus {''}
      <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta}/>}
      {tokenValido && (
        <form 
          className="mt-10 bg-white shadow rounded-lg px-10 p-10"
          onSubmit={handleSubmit}

        >
         <div className="my-5">
           <label 
             className="uppercase text-gray-600 block text-xl font-bold"
             htmlFor="password"
           >Nuevo Password</label>
           <input
             id="password"
             type="Password"
             placeholder="Nuevo Password"
             className="w-full mt-3 p-3 border rounded-xl bg-gray-100 "
             value={password}
             onChange={e => setPassword(e.target.value)}
           />
         </div>
   
         <input 
           type="submit" 
           value='Guardar Nuevo Password'
           className="bg-sky-700 mb-5 w-full rounded-xl py-3 text-white uppercase font-bold hover:cursor-pointer hover:bg-sky-900 transition-colors"
         />
        </form>
      )}
       {passwordModificado &&(
            <Link
              className="block text-center my-5 text-slate-500 uppercase text-sm"
              to='/'
            >Inicia sesion
            </Link> 
        )}

    </>
  
  )
}

export default NuevoPassword