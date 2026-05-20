import conf from "../conf/conf";
import { Client, Account,ID } from "appwrite";

// const client = new Client()
//     .setProject("conf.appwriteProjectId")// Your project ID
//     .setEndpoint('https://<REGION>.cloud.appwrite.io/v1'); // Your API Endpoint

// const account = new Account(client);

// try {
//     const user = await account.create({
//         userId: '[USER_ID]',
//         email: 'email@example.com',
//         password: '<Password>'
//     });
//     console.log(user)
// } catch (e){
//     console.error(e)
// }

export class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
                    .setEndpoint(conf.appwriteURL)
                    .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({email,password,name}) {
        try {
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email,
                password,
                name
            })
            //auto login after signup
            if (userAccount) {
                return this.login({ email, password });
            }
        } 
        catch (error) {
            throw error;
            
        }
    }

    async login({email, password}){
        try {
            // 🔹 If session already exists → delete it first
            try {
            await this.account.get()
            await this.account.deleteSessions()
            } catch (e) {
            // no session exists → ignore
            }

            // 🔹 Create fresh session
            return await this.account.createEmailPasswordSession({
                email,
                password})
        } catch (error) {
            throw error
        }
    }
    //// GET CURRENT USER
    async getCurrentUser(){
        try {
          return await this.account.get();
        } catch (error) {
            // If user not logged in → this is NORMAL
        if(error.code === 401){
            return null;
        }
            console.log("Appwrite service :: getCurrentUser :: error",error)
        }
        return null
    }
    // LOGOUT
    async logout(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            console.log("Appwrite service :: logout:: error",error)
        }
    }
}

const authService = new AuthService();


export default authService