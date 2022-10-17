import { Form, useTransition } from "@remix-run/react";
import { useState } from "react";
import cn from "classnames";

export default function SearchBar(){

  const [searchTerm, setSearchTerm] = useState("");
  const transition = useTransition()

  const handleInput = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Form
      method="post"
      style={{border:"2px solid black"}}
      className={cn(
        "flex flex-row"
  )}
    >
      <input type='hidden' name="filterType" value="search" />

      <input
      className= {cn(
          "p-2 m-2 text-start tracking-tight font-bold text-gray-700",
      )}
        style={{flex: 1, alignItems: 'center'}}
        type="text"
        name="searchString"
        value = {searchTerm}
        placeholder={"Enter a Feature Description"}
        onChange={handleInput}
      />

      {searchTerm.length > 0 && (
        <button
          className="m-2 p-2 rounded-lg bg-slate-300 hover:bg-slate-400 text-white font-bold"
          type="submit">
          {transition.state === 'submitting' ? "Searching..." : "Search"}
        </button>
      )}
    </Form>
  )
}
