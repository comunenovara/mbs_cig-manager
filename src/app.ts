import { Web } from "./web";

async function main() {
	let web = new Web();
	web.start();
}

let port = "3002";
if (process.env.PORT !== undefined) {
	port = process.env.PORT;
}
export const PORT = port;

let mainUrl = "http://localhost:" + PORT;
if (process.env.MAIN_URL !== undefined) {
	mainUrl = process.env.MAIN_URL;
}
export const MAIN_URL = mainUrl;

let mainPath = "";
if (process.env.MAIN_PATH !== undefined) {
	mainPath = process.env.MAIN_PATH;
}
export const MAIN_PATH = mainPath;

main();