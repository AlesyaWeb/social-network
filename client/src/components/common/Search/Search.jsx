import React, {useState} from 'react';
import SearchList from "./SearchList";
const Search = ({details}) => {
    const [searchField, setSearchField] = useState("");
    const filteredPersons = details.filter(
        person => {
            return (
                person
                    .first_name
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) ||
                person
                    .last_name
                    .toLowerCase()
                    .includes(searchField.toLowerCase())
            );
        }
    );
    console.log(filteredPersons)
    function searchList() {
        return (
            <SearchList filteredPersons={filteredPersons} type={"users"} />
        );
    }
    const handleChange = e => {
        setSearchField(e.target.value);
    };
    return (
        <div>
            <div className="navy georgia ma0 grow">
                <h2 className="f2">Search your course</h2>
            </div>
            <div className="pa2">
                <input
                    className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
                    type = "search"
                    placeholder = "Search People"
                    onChange = {handleChange}
                />
            </div>
            {searchList()}
        </div>
    );
};

export default Search;