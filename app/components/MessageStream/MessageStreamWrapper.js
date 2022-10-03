import { useEffect } from "react"
import MessageCard from "~/components/MessageStream/MessageCard"



export default function MessageStreamWrapper(props){
  useEffect(()=>{
    console.log("MESSAGE STREAM DATA", props.data)
  }, [props])

  return(
    <div className='messageStreamWrapper'>
      <div className='messageStream'>
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
