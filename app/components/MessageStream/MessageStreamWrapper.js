import { useEffect } from "react"
import MessageCard from "~/components/MessageStream/MessageCard"



export default function MessageStreamWrapper(props){
  useEffect(()=>{
    console.log("MESSAGE STREAM DATA", props.data)
  }, [props])

  return(
    <div className='messageStreamWrapper'>
      <div className="searchBarWrapper">
      <input className="searchBar" />
      <button className="searchButton">Search</button>

      </div>
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
