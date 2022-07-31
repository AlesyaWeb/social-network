import React from 'react';
import User from "../../main-components/Users/User/User";
import Friend from "../../main-components/Friends/Friend/Friend";

const SearchList = ({filteredUsers, type}) => {
    console.log(filteredUsers)
    let filtered
    if(type === "users") {
        filtered = filteredUsers.map(person => <User  preson={person} />)
    }
    else if (type === "friends") {
        filtered = filteredUsers.map(person => <Friend person={person} /> )
    }
    return (
        <div>
            {filtered}
        </div>
    );
};

export default SearchList;