
export default function MessageStreamMetadata(props){

  function handleChange(event){
    console.log("CHANGED SELECT!", event.target.value)
  }

  return(
    <div className='messageStreamMetadataRow'>
      <p>{props.data.length} feature requests</p>
      <div>
        <p>Sort By</p>
      </div>
    </div>
  )
}
