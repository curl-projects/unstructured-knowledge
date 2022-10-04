import { Form } from "@remix-run/react";

export default function SearchBar(){
  return(
    <div className="searchBarWrapper">
      <Form method="post">
      <input className="searchBar"
             type="text"
             name="searchString"
        />
      <button className="searchButton" type="submit">Search</button>
      </Form>
    </div>
  )
}
