import * as d3 from 'd3';

export default function MessageCard(props){

  function handleMouseOver(event, cardIdx){
    d3.select(`#fr-${cardIdx}`)
    .transition()
    .duration(200)
    .ease(d3.easeCubicInOut)
    .attr("r", 20)
    .attr('stroke', 'red')
  }
  function handleMouseOut(event, cardIdx){
    d3.select(`#fr-${cardIdx}`)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .attr("r", 5)
      .attr('stroke', 'none')
  }

  return(
    <div
      className='messageCard'
      onMouseOver={event=>handleMouseOver(event, props.cardData.index)}
      onMouseOut={event=>handleMouseOut(event, props.cardData.index)}
      >
      <h4>{props.cardData && props.cardData['feature requests']}</h4>
      <p>{props.cardData['prompt']}</p>
    </div>
  )
}
