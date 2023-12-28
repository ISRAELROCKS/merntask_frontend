import useProyectos from "../hooks/useProyectos";

const Colaborador = ({colaborador}) => {

    const {handleModalEliminarColaborador} = useProyectos();
    const {nombre, email} = colaborador;
  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p>{nombre}</p>
            <p className="text-sm text-gray-700">{email}</p>
        </div>
        <div>
            <button
                onClick={() => handleModalEliminarColaborador(colaborador)}
                type="button"
                className="  bg-red-600 px-4 py-2 uppercase text-white hover:bg-red-200 font-bold text-sm rounded-lg"
            >Eliminar
            </button>
        </div>

    </div>
  )
}

export default Colaborador