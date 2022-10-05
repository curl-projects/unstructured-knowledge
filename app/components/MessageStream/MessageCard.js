import * as d3 from 'd3';

export default function MessageCard(props){

  const options = {day: 'numeric', month: "long", year: "numeric"};
  const date = props.cardData.created_at ? new Date(props.cardData.created_at).toLocaleDateString('default', options ) : "n.d.";

  function handleMouseOver(event, fr_id){
    d3.select(`#fr-${fr_id}`)
    .classed("mouseOverFr", true)
    .transition()
    .duration(200)
    .ease(d3.easeCubicInOut)
    .attr('stroke', 'red')
    .attr("r", 20)

  }
  function handleMouseOut(event, fr_id){
    d3.select(`#fr-${fr_id}`)
      .classed("mouseOverFr", false)
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
      <p>{props.cardData && props.cardData.author}    {date}</p>
      <p>{props.cardData.message}</p>
    </div>
  )
}
