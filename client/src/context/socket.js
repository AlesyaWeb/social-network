import {io} from "socket.io-client";
const ENDPOINT = 'http://localhost:3008'; // for prod. https://socnet-backend.herokuapp.com for dev. http://localhost:3008
export default io(ENDPOINT);