import { useState } from 'react';
import * as d3 from 'd3';
import cn from "classnames";

import { AiOutlinePushpin } from "react-icons/ai";


export default function MessageCard(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // const options = {day: 'numeric', month: "long", year: "numeric"};
  // const date = props.cardData.created_at ? new Date(props.cardData.created_at).toLocaleDateString('default', options ) : "n.d.";

  function handleMouseOver(event, fr_id) {
    d3.select(`#fr-${fr_id}`)
      .classed("mouseOverFr", true)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .attr('stroke', 'red')
      .attr("r", 20)

  }
  function handleMouseOut(event, fr_id) {
    d3.select(`#fr-${fr_id}`)
      .classed("mouseOverFr", false)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .attr("r", 5)
      .attr('stroke', 'none')
  }

  // remove hyphen at start or numbers
  // remove full stop at start
  // remove full stop at end

  const cleanSummary = props.cardData.fr
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/^-/, '').replace(/^[0-9]+/, '')
    .replace(/^\./, "")

  return (
    <div
      className='messageCard relative'
      onMouseOver={event => handleMouseOver(event, props.cardData.fr_id)}
      onMouseOut={event => handleMouseOut(event, props.cardData.fr_id)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className='bg-white px-2 py-1 rounded-md leading-5 text-sm text-gray-500 hover:text-gray-900 font-medium'>
        {props.cardData && cleanSummary}
      </div>

      {isExpanded && (
        <div
          className={cn(
            "flex flex-col gap-2 p-",
          )}>
          <p>{props.cardData && props.cardData.author}</p>
          <p>{props.cardData.message}</p>
        </div>
      )}

      <div className='absolute top-2 -left-8'>
        <p className='text-sm text-gray-400'>
          <AiOutlinePushpin
            size={22}
            onClick = {() => setIsPinned(!isPinned)}
            className={cn(
              "bg-slate-200 rounded-full m-1 p-1",
              {"visible": isPinned},
              {"visible": !isPinned}
            )} />
        </p>
      </div>
    </div>
  )
}
