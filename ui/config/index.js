var apiUrl;
var username;
var password;

if (import.meta.env.MODE === "development") {
    apiUrl = 'http://localhost:8080';
    username = 'dev';
    password = 'dev';
} else if (import.meta.env.MODE === "demo") {
    apiUrl = 'https://ansible-manager-api.rdvl-server.site';
    username = 'admin';
    password = 'admin';
} else {
    apiUrl = import.meta.env.VITE_API_URL;
    username = import.meta.env.VITE_USERNAME;
    password = import.meta.env.VITE_PASSWORD;
}

export { apiUrl, username, password };