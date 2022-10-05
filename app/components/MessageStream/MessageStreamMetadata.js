
export default function MessageStreamMetadata(props){

  function handleChange(event){
    console.log("CHANGED SELECT!", event.target.value)
  }

  return(
    <div className='messageStreamMetadataRow'>
      {props.zoomObject && <p>Viewing data for Cluster {props.zoomObject}</p>}
      <p>{props.data.length} feature requests</p>
      <div>
        <p>Sort By</p>
      </div>
    </div>
  )
}
