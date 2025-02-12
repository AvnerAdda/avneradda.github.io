import * as admin from "firebase-admin";
import {scheduledFetchNews} from "./fetchNews";

admin.initializeApp();

export {scheduledFetchNews};
