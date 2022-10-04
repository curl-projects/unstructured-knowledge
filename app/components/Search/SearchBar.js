import { Form } from "@remix-run/react";

export default function SearchBar(props){
  return(
      <Form method="post" className="searchBarWrapper">
        <input className="searchBar"
               type="text"
               name="searchString"
               onChange={props.resetSearchData}
          />
        <button className="searchButton" type="submit">Search</button>
      </Form>
  )
}
