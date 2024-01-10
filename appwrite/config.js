import { Client, Databases,ID,Query,Permission,Storage} from "appwrite";
import { PROJECT_ID } from "../utils/sceret.js";
const client = new Client();

const databases = new Databases(client);
const storage = new Storage(client);
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);



export { client, databases,ID,Query,Permission,storage };

