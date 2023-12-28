
const Alerta = ({alerta}) => {//se pasa como prop alerta 
  return (
    <div
    className={`${alerta.error ? 'from-red-300 to-red-700': 'from-sky-400 to-sky-700'} 
                bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`
                }
    >
        {alerta.msg}
    </div>
  )
}

export default Alerta