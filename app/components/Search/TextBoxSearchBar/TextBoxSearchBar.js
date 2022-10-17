import { Form } from "@remix-run/react";
import { useState } from "react";
import cn from "classnames";

export default function TextBoxSearchBar({resetSearchData, isSubmitted, setSubmitted, setFocus}) {

  const [searchTerm, setSearchTerm] = useState("");

  const handleInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const submitIfFull = (event) => {
    if (searchTerm.length > 0) {
      event.preventDefault();
      setSubmitted(true);
      resetSearchData();
    } else {
      event.preventDefault();
    }
  };

  const startOver = () => {
    setSubmitted(false);
    setSearchTerm("");
  }

  const handleBlur = () => {
    if (searchTerm.length > 0) {
      return
    }
    setFocus(false);
  }

  return (
    <Form
      // TODO: @finn: make the search query logic work
      // method="post"
      className={cn(
        "flex flex-col",
        {"shrink": isSubmitted},
        {"grow": !isSubmitted}

  )}
    >
      <input type='hidden' name="filterType" value="search" />

      <textarea
      className= {cn(
          "pt-5 pl-5 text-start tracking-tight font-bold text-gray-700 text-4xl",
          {"grow": !isSubmitted},
          {"h-fit": isSubmitted},
          {"cursor-not-allowed": isSubmitted}
      )}
        type="text"
        name="searchString"
        value = {searchTerm}
        placeholder={"Enter a Feature Description"}
        onChange={handleInput}
        readOnly = {isSubmitted}
        onFocus={() => setFocus(true)}
        onBlur={() => handleBlur()}
      />

      {!isSubmitted && searchTerm.length > 0 && (
        <button
          className="m-2 p-2 rounded-lg bg-slate-300 hover:bg-slate-400 text-white font-bold"
          type="submit"
          onClick={(e) => submitIfFull(e)}>
          Submit
        </button>
      )}
      {isSubmitted && (
       <button
       className="m-2 p-2 rounded-lg bg-slate-300 hover:bg-slate-400 text-white font-bold"
       type="submit"
      onClick={(e) => startOver()}
      >
        Start Over
      </button>
      )}

    </Form>
  )
}
