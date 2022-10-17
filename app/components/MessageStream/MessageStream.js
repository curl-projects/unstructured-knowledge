import { useState } from "react"
import MessageStreamMetadata from "~/components/MessageStream/MessageStreamMetadata"
import MessageCard from "~/components/MessageStream/MessageCard"

export default function MessageStream(props){
  
  const [isExpanded, setIsExpanded] = useState(false);

  return(
    <>
      
      <div className='flex flex-col align-middle pt-4 gap-2'>
        <MessageStreamMetadata
          data={props.data}
          zoomObject={props.zoomObject}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          />
        {props.data.map((cardData, idx) => (
          <MessageCard
            key={idx}
            cardData={cardData}
            isExpanded = {isExpanded}
            />
        ))}
      </div>
    </>
  )
}
