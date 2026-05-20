import conf from "../conf/conf";
import {Client, ID, Databases, Storage, Query, Permission, Role} from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;
    

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
        console.log("BUCKET ID =", conf.appwriteBucketId);
    }

    // ===============================
    // POSTS (DATABASE)
    // ===============================

    async createPost({title, slug, content, featuredImage, status, userId}) {
    return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(), // ✅ FIX HERE
        {
            title,
            slug,
            content,
            featuredImage,
            status,
            userId,
        },
        [
                
                Permission.read(Role.user(userId)),       // anyone can read post
                Permission.update(Role.user(userId)),    // only author can edit
                Permission.delete(Role.user(userId)),    // only author can delete
            ]
    );
}

    async updatePost(documentId, data) {
    return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId,
        data
    );
}

    async deletePost(documentId) {
    try {
        await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            documentId
        );
        return true;
    } catch (error) {
        console.log("Appwrite :: deletePost :: error", error);
        return false;
    }
}

    async getPost(documentId) {
    try {
        return await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            documentId
        );
    } catch (error) {
        console.log("Appwrite :: getPost :: error", error);
        return false;
    }
}



    async getPosts(userId) {
    try {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
            Query.equal("userId", userId) //only user's posts
        ]
        );
    } catch (error) {
        console.log("Appwrite :: getPosts :: error", error);
        return false;
    }
}

    // ===============================
    // FILE STORAGE
    // ===============================

    async uploadFile(file, userId) {
    try {
        return await this.bucket.createFile(
            conf.appwriteBucketId,
            ID.unique(),
            file,
            [
                Permission.read(Role.any()),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
    } catch (error) {
        console.log("Appwrite :: uploadFile :: error", error);
        return null;   // IMPORTANT
    }
    }

    async deleteFile(fileId) {
    try {
        await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
        return true;
    } catch (error) {
        console.log("Appwrite :: deleteFile :: error", error);
        return false;
    }
}

    // getFilePreview(fileId) {
    // if (!fileId) return "";

    // try {
    //     // ⭐ This request includes login session automatically
    //     const url = this.bucket.getFilePreview(
    //     conf.appwriteBucketId,
    //     fileId,
    //     2000, // width
    //     2000, // height
    //     "top",
    //     100
    //     );

    //     return url.toString(); // VERY IMPORTANT
    //     } 
    //     catch (error) {
    //         console.log("Appwrite :: preview error", error);
    //         return "";
    //     }
    // }
getFileView(fileId) {
  if (!fileId) return "";

  try {
    const url = this.bucket.getFileView(
      conf.appwriteBucketId,
      fileId
    );

    return url.toString(); // ⭐ THIS IS THE KEY
  } catch (error) {
    console.log("Appwrite :: getFileView :: error", error);
    return "";
  }
}
    

}

const service = new Service();
export default service;