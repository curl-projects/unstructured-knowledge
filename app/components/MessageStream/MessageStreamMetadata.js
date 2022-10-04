export default function MessageStreamMetadata(props){
  return(
    <div className='messageStreamMetadataRow'>
      <p>{props.data.length} feature requests</p>
    </div>
  )
}
