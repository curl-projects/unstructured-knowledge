
export default function MessageStreamMetadata(props){

  function handleChange(event){
    console.log("CHANGED SELECT!", event.target.value)
  }

  return(
    <div className='sticky top-0 p-2 bg-slate-100/50 backdrop-blur-lg text-sm'>
      {props.zoomObject && <p>Viewing data for Cluster {props.zoomObject.id}</p>}
      <p className="text-gray-800 font-semibold">{props.data.length} <span className="text-gray-400 font-normal"> Feature Requests</span> </p> 
      <div>
      </div>
    </div>
  )
}
