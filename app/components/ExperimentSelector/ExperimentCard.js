import { Link } from "@remix-run/react";
import { useEffect, useState } from 'react';
import cn from "classnames";

export default function ExperimentCard({exp}){
  const [isCardExpanded, setIsCardExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return(
    <div className="experimentCard relative"
         key={exp.url}
         onClick={()=>setIsCardExpanded(!isCardExpanded)}
         onMouseOver={()=>setIsHovered(true)}
         onMouseOut={()=>setIsHovered(false)}
         >
        <Link to={`experiments/${exp.url}`}>
          <div className={cn("bg-white px-1 py-1 cursor-pointer tracking-tight leading-5 text-md text-gray-600 font-medium",
                            {'text-gray-800' : isHovered}
          )}>
            {exp.name}
          </div>
        </Link>
        {
          isCardExpanded && (
            <div className="flex flex-col gap-2 px-3 py-2 text-sm tracking-tight text-gray-600/90 font-normal">
              {exp.hypothesis &&<p className="text-gray-700 leading-5"><b>Hypothesis:</b> {exp.hypothesis}</p>}
            </div>
          )
        }
    </div>
  )
}
