import { useMatches, Link } from "@remix-run/react";
import { useEffect, useState } from 'react';
import ExperimentCard from "~/components/ExperimentSelector/ExperimentCard";
import cn from "classnames";

const publicExperiments = [
  { name: "Experiment One", url: "experimentOne"},
  { name: "Experiment Two", url: "experimentTwo"},
  { name: "Experiment Three", url: "experimentThree", hypothesis: "Users can sense-make about product development by reading contextually important information and making scrappy notes on it"},
  { name: "Experiment Four", url: "experimentFour"},
]

export default function ExperimentSelector(){
  const matches = useMatches();
  const [isCardExpanded, setIsCardExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)


  useEffect(() => {
    console.log("MATCHES", matches)
  }, matches)

  return(
    <div className={cn("absolute bottom-10 left-10 bg-gray-100 xl:w-2/12 md:w-3/12 sm:w-5/12 overflow-x-hidden overflow-y border transition-opacity",
                     {'opacity-25' : !isHovered}
                   )}
      style={{height: "200px", zIndex: 100}}
      onMouseOver={()=>setIsHovered(true)}
      onMouseOut={()=>setIsHovered(false)}
      >
      <div className="flex relative flex-col align-middle pt-2 gap-2">
        {publicExperiments.map((exp, idx) =>
          <ExperimentCard
              exp={exp}
              key={exp.url}
              />
        )}
      </div>
    </div>
  )
}
