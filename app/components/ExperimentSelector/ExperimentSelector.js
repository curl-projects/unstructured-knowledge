import { Link } from "@remix-run/react";
import { useEffect, useState } from 'react';
import ExperimentCard from "~/components/ExperimentSelector/ExperimentCard";
import cn from "classnames";
import {AiOutlineArrowUp} from 'react-icons/ai';

const publicExperiments = [
  { name: "Experiment One", url: "experimentOne"},
  { name: "Experiment Two", url: "experimentTwo"},
  { name: "Experiment Three", url: "experimentThree", hypothesis: "Users can sense-make about product development by reading contextually important information and making scrappy notes on it"},
  { name: "Experiment Four", url: "experimentFour"},
]

export default function ExperimentSelector(){
  const [isCardExpanded, setIsCardExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isRolledUp, setIsRolledUp] = useState(false)

  return(
    <div className={cn("absolute bottom-10 left-10 bg-gray-100 xl:w-2/12 md:w-3/12 sm:w-5/12 overflow-x-hidden overflow-y border transition-opacity",
                     {'opacity-25' : !isHovered},
                     {'h-10': isRolledUp},
                     {'h-52': !isRolledUp}
                   )}
      style={{zIndex: 100}}
      onMouseOver={()=>setIsHovered(true)}
      onMouseOut={()=>setIsHovered(false)}
      >
      <div className="flex w-full justify-end items-center sticky top-0 px-4 py-2 z-10 bg-gray-100/90 backdrop-blur-sm text-xs">
        <div className='flex gap-1'>
          <AiOutlineArrowUp
          size = {20}
          className={cn("inline-block bg-slate-50 cursor-pointer hover:bg-white rounded-full  p-1 text-gray-500",
                        {'rotate-180': !isRolledUp}
                    )}
          onClick = {() => setIsRolledUp(!isRolledUp)}
          />
        </div>
      </div>

      {!isRolledUp && (
        <div className="flex relative flex-col align-middle gap-2">
          {publicExperiments.map((exp, idx) =>
            <ExperimentCard
                exp={exp}
                key={exp.url}
                />
          )}
        </div>
      )
      }
    </div>
  )
}
