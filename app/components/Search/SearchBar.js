import { Form } from "@remix-run/react";

export default function SearchBar(){
  return(
      <Form method="post" className="searchBarWrapper">
        <input className="searchBar"
               type="text"
               name="searchString"
          />
        <button className="searchButton" type="submit">Search</button>
      </Form>
  )
}
