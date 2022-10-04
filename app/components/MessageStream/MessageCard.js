import * as d3 from 'd3';

export default function MessageCard(props){

  function handleMouseOver(event, fr_id){
    d3.select(`#fr-${fr_id}`)
    .transition()
    .duration(200)
    .ease(d3.easeCubicInOut)
    .attr("r", 20)
    .attr('stroke', 'red')
  }
  function handleMouseOut(event, fr_id){
    d3.select(`#fr-${fr_id}`)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .attr("r", 5)
      .attr('stroke', 'none')
  }

  return(
    <div
      className='messageCard'
      onMouseOver={event=>handleMouseOver(event, props.cardData.fr_id)}
      onMouseOut={event=>handleMouseOut(event, props.cardData.fr_id)}
      >
      <h4>{props.cardData && props.cardData.fr}</h4>
      <p>{props.cardData.message}</p>
    </div>
  )
}
