import { useEffect } from "react"
import MessageStreamMetadata from "~/components/MessageStream/MessageStreamMetadata"
import MessageCard from "~/components/MessageStream/MessageCard"
import SearchBar from "~/components/Search/SearchBar"

export default function MessageStream(props){
  // useEffect(()=>{
  //   console.log("MESSAGE STREAM DATA", props.data)
  // }, [props])

  return(
    <>
      <SearchBar
        resetSearchData={props.resetSearchData}
        />
      <div className='messageStream'>
        <MessageStreamMetadata
          data={props.data}
          zoomObject={props.zoomObject}
          />
        {props.data.map((cardData, idx) => (
          <MessageCard
            key={idx}
            cardData={cardData}
            />
        ))}
      </div>
    </>
  )
}
