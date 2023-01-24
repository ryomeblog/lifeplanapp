import axios from "axios";

const instance = axios.create({
    baseURL: "dynamodb:8000",
    headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'dynamodb:8000',
        'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        credentials: true,
        withCredentials: true
     },
    responseType: 'json'
});
instance.defaults.withCredentials = true;

export default instance;