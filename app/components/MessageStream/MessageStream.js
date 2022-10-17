import { useState, useEffect, useRef } from "react"
import MessageStreamMetadata from "~/components/MessageStream/MessageStreamMetadata"
import MessageCard from "~/components/MessageStream/MessageCard"

export default function MessageStream(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [pins, setPinned] = useState([]);
  const paneRef = useRef(null);

  const pinCard = (fr_id) => {
    setPinned([...pins, fr_id])
  }

  useEffect(() => {
    const pane = paneRef.current;

    pane.addEventListener('scroll', () => {
      if (pane.scrollY > 200) {
        console.log("scrolling")
      }
    })
    return () => {
      pane.removeEventListener('scroll', () => {
        console.log("scrolling")
      })

    }
  }, [])

  const scrollToTop = () => {
    paneRef.current.scrollIntoView();
  }

  // pinned cards
  const pinnedCards = props.data.filter(d => pins.includes(d.fr_id))
  // rest of the cards
  const remainingCards = props.data.filter(d => !pins.includes(d.fr_id))

  return (
    <>

      <div ref={paneRef} className='flex relative flex-col align-middle pt-2 gap-2'>
        <MessageStreamMetadata
          data={props.data}
          zoomObject={props.zoomObject}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          scrollToTop={scrollToTop}
          paneRef={paneRef}
        />
        <div className="pl-10 pr-8 flex flex-col gap-2">
          {pinnedCards.map((cardData, idx) => (
            <MessageCard
              key={cardData.fr_id}
              cardData={cardData}
              isExpanded={isExpanded}
              pinCard={pinCard}
              isPinned={true}
            />
          ))}
          {pinnedCards.length > 0 && <h1 className="text-gray-400 text-xs font-medium pl-4">Remaining Feature Requests</h1>}
          {remainingCards.map((cardData, idx) => (
            <MessageCard
              key={cardData.fr_id}
              cardData={cardData}
              isExpanded={isExpanded}
              pinCard={pinCard}
            />
          ))}
        </div>

      </div>
    </>
  )
}
