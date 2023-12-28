import { useState,useEffect,useContext, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import {useNavigate} from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import io from 'socket.io-client'

let socket ;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    
    const [proyectos, setProyectos] = useState([]);
    const [alerta,setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea,setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({})// ESTADO PARA EDITAR TAREA
    const [modalEliminarTarea, setModalEliminarTarea]= useState(false)//Modal paraEliminar Tarea
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador,setModalEliminarColaborador] = useState(false)
    const [buscador,setBuscador] = useState(false)
    

    const navigate = useNavigate();
    const {auth} = useAuth()

    useEffect( () => {
        const obtenerProyectos = async () => {  
            try {
                const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
                if(!token)return // si no hay un token retornamos

            const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    },[auth])
    // SOCKET IO 
    useEffect(() =>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
    },[])

    useEffect(()=>{
        socket.on('tarea agregada', tareaNueva =>{
          console.log(tareaNueva)
        })
    })

    const mostrarAlerta = alerta => {
        setAlerta(alerta);
        setTimeout(()=>{
            setAlerta({})
        },5000);
    }

    const submitProyecto = async proyecto =>{
        if(proyecto.id){
           await editarProyecto(proyecto)
        }else{
           await nuevoProyecto(proyecto)
        }
        return
    }   
    const editarProyecto = async proyecto =>{
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
            if(!token)return // si no hay un token retornamos

        const config = { //creamos la configuracion para los headers y LA AUTORIZACION DEL token
            headers: {
                "Content-Type":'application/json',
                Authorization:`Bearer ${token}`
            }
        }
        const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
        // SINCROZAR EL STATE
        const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data: proyectoState);
            setProyectos(proyectosActualizados)
        // MOSTRAR EL ALERTA DE ACTUALIZADO
        setAlerta({
            msg:'proyecto actualizado correctamente',
            error:false
        })
        // REDIRECCIONAR
        setTimeout(()=>{
            setAlerta({})
            navigate('/proyectos')
        },3000);
        
        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto =>{
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
                if(!token)return // si no hay un token retornamos

            const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos', proyecto, config)
            setProyectos([...proyectos,data])

            setAlerta({
                msg:'proyecto creado correctamente',
                error:false
            })

            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },3000);
        } catch (error) {
            console.log(error)
        }
    

    }
    const obtenerProyecto = async id =>{
        setCargando(true)
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
                if(!token)return // si no hay un token retornamos

            const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios(`/proyectos/${id}`, config)//para peticiones GET como es el default no hace falta pinerle el clienteAxios.get()
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() =>{
                setAlerta({})
            },3000)
        }finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
      try {
        const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
        if(!token)return // si no hay un token retornamos

        const config = { //creamos la configuracion para los headers y el token
        headers: {
            "Content-Type":'application/json',
            Authorization:`Bearer ${token}`
        }
    }
        const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
            // SINCRONIZAR EL STATE
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id )
            setProyectos(proyectosActualizados)
            setAlerta({
              msg: data.msg,
              error:false
            })
            // SINCRONIZAR EL STATE
            setTimeout(()=>{
              setAlerta({})
                 navigate('/proyectos')
             },2000);
        } catch (error) {
             console.log(error)
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({});// PARA QUE EL MODAL SE SETEE Y ESTA COMO UN OBJETO VACIO
    }

    const submitTarea = async tarea => {
        console.log(tarea)
        if (tarea?.id) {
          await editarTarea(tarea)
        } else {
          delete tarea.id
          await crearTarea(tarea)
        }
    }
    const crearTarea = async tarea =>{
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
                if(!token)return // si no hay un token retornamos

            const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/tareas',tarea, config)
            
          
            setAlerta({})
            setModalFormularioTarea(false)//cierra el modal

            // SOCKET IO
            socket.emit('nueva tarea',data)
        } catch (error) {
            console.log(error);
        }

    }
    //funcion para editar tarea
    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
                if(!token)return // si no hay un token retornamos

            const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
          
            setAlerta({})
            setModalFormularioTarea(false)
            //socket 
            socket.emit('actualizar tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    // FUNCION PARA EDITAR TAREA 
    const handleModalEditarTarea = tarea => {
        setTarea(tarea)//seteaqr tarea para que aparesca en el state 
        setModalFormularioTarea(true)//setear el formulario pasarlo a true para que aparezcan los campos de la tarea completa 
    }

    //Modal para Eliminar Tarea
    const handleModalEliminarTarea = async tarea =>{
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea)
    }

    //funcion para eliminar tarea

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
                if(!token)return // si no hay un token retornamos

            const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)//cuando es un delete no requieres pasarle nada solo el config del token
            setAlerta({
                msg: data.msg,
                eror: false 
            })
            
            setModalEliminarTarea(false)
            
            //socket 
            socket.emit('eliminar tarea',tarea)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            },3000)

        } catch (error) {
            console.log(error)
        }
    }
    //agregar colaboradores
    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
                if(!token)return // si no hay un token retornamos

            const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg ,
                error: true
            })
        }finally{
            setCargando(false)
        }
    }
    const agregarColaborador = async email => {
       try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
            if(!token)return // si no hay un token retornamos

                const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
        const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            },3000);
            
       } catch (error) {
            setAlerta({
                msg: error.response.data.msg ,
                error: true
            })
       }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }
    const eliminarColaborador = async () =>{
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
            if(!token)return // si no hay un token retornamos

                const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
        const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id:colaborador._id}, config);
        //actualizar el state para colaboradores
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id);
        setProyecto(proyectoActualizado);

        setAlerta({
            msg: data.msg,
            error:false
        });
        setColaborador({});
        setModalEliminarColaborador(false)

        setTimeout(() => {
            setAlerta({})
        },3000)
        
        } catch (error) {
            console.log(error.response)
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token'); //obtenemos el token que esta almacenado en el localstorage
            if(!token)return // si no hay un token retornamos

                const config = { //creamos la configuracion para los headers y el token
                headers: {
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/tareas/estado/${id}` ,{} ,config )

            setTarea({})
            setAlerta({})
            //socket
            socket.emit('cambiar estado', data)
          
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)

    }

    const submitTareasProyecto = (tarea) =>{
          // agrega la tarea al state
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyecto.tareas, tarea ]
        setProyecto(proyectoActualizado)// actualiza las tareas 
    }

    const eliminarTareaProyecto = tarea =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState =>tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }
    const actualizarTareaProyecto = tarea => {
          //  actualizr el dom
        const proyectoActualizado ={...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
            tareaState._id === tarea._id ? tarea : tareaState);
        setProyecto(proyectoActualizado);
    }
    const cambiarEstadoTarea = tarea =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () =>{
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return(// todo lo que este adentro del return es lo que se ara disponible en todos los componentes
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos,

                
            }}
            //los children pasan funciones a componentes 
        >{children} 
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext;