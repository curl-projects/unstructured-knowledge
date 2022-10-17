import {IoExpand, IoContract} from 'react-icons/io5';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default function MessageStreamMetadata({isExpanded, setIsExpanded, ...props}) {

  return (
    <div className='flex justify-between items-center sticky top-0 py-2 px-1 z-10 bg-slate-100/50 backdrop-blur-lg text-xs'>
      <p
        className="text-gray-800 font-bold"
      >
        {numberWithCommas(props.data.length)} <span className="text-gray-400 font-medium"> Feature Requests</span>
      </p>
      
      <div onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded?
           <IoContract size={22} className="inline-block bg-slate-50 cursor-pointer hover:bg-slate-100 rounded-full  p-1 text-gray-500" /> : 
           <IoExpand size={22} className="inline-block bg-slate-50 cursor-pointer hover:bg-slate-100 rounded-full p-1 text-gray-500" /> }
      </div>
    </div>
  )
}
