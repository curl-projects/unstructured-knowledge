import { Form, useSubmit, useTransition } from "@remix-run/react";
import { useState, useEffect } from "react";
import cn from "classnames";
// IMAGES
import boids from "../../../../public/assets/boids.gif";


export default function TextBoxSearchBar({ resetSearchData, isSubmitted, setSubmitted, setFocus }) {
  const submit = useSubmit();
  const transition = useTransition()
  const [searchTerm, setSearchTerm] = useState("");

  const handleInput = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    console.log("TRANSITION STATE", transition.state)
  }, [transition.state])

  const submitIfFull = (event) => {
    if (searchTerm.length > 0) {
      event.preventDefault();
      setSubmitted(true);
      submit(event.currentTarget, { method: 'post' })
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

  const boidsBg = {
    backgroundImage: `url(${isSubmitted? "" : boids})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }

  return (
    <Form
      method="post"
      className={cn(
        "flex flex-col",
        { "shrink": isSubmitted },
        { "grow": !isSubmitted }

      )}
    >
      <input type='hidden' name="filterType" value="search" />

      <textarea
        style={boidsBg}
        className={cn(
          "pt-5 pl-5 text-start font-bold text-gray-700 text-4xl",
          { "grow": !isSubmitted },
          { "h-fit": isSubmitted },
          { "cursor-not-allowed": isSubmitted }
        )}
        type="text"
        name="searchString"
        value={searchTerm}
        placeholder={"Enter a Feature Description"}
        onChange={handleInput}
        readOnly={isSubmitted}
        onFocus={() => setFocus(true)}
        onBlur={() => handleBlur()}
      />

      {!isSubmitted && searchTerm.length > 0 && (
        <button
          className="m-2 p-2 bg-slate-300 hover:bg-slate-400 text-white font-bold"
          type="submit"
          onClick={(e) => submitIfFull(e)}>
          Submit
        </button>
      )}
      {isSubmitted && (
        <button
          className="m-2 p-2  bg-slate-300 hover:bg-slate-400 text-white font-bold"
          type="submit"
          onClick={(e) => startOver()}
        >
          {transition.state === 'submitting' ? "Finding relevant features..." : "Start Over"}
        </button>
      )}
    </Form>
  )
}
