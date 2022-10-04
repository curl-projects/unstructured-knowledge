import { useEffect } from "react"
import MessageStreamMetadata from "~/components/MessageStream/MessageStreamMetadata"
import MessageCard from "~/components/MessageStream/MessageCard"
import SearchBar from "~/components/Search/SearchBar"

export default function MessageStreamWrapper(props){
  useEffect(()=>{
    console.log("MESSAGE STREAM DATA", props.data)
  }, [props])

  return(
    <div className='messageStreamWrapper'>
      <SearchBar />
      <div className='messageStream'>
        <MessageStreamMetadata
          data={props.data}
          />
        {props.data.map((cardData, idx) => (
          <MessageCard
            key={idx}
            cardData={cardData}
            />
        ))}
      </div>
    </div>
  )
}
