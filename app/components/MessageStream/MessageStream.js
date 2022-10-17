import { useEffect } from "react"
import MessageStreamMetadata from "~/components/MessageStream/MessageStreamMetadata"
import MessageCard from "~/components/MessageStream/MessageCard"

export default function MessageStream(props){
  // useEffect(()=>{
  //   console.log("MESSAGE STREAM DATA", props.data)
  // }, [props])

  return(
    <>
      
      <div className='flex flex-col align-middle pt-4 gap-2'>
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
