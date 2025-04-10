import conf from "../conf/conf.js";
import {
  Client,
  ID,
  Databases,
  Storage,
  Query,
  Permission,
  Role,
} from "appwrite";

class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    console.log("Appwrite Project ID:", conf.appwriteProjectId);

    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // Create a new post
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.error("Appwrite :: createPost Error:", error);
      throw error;
    }
  }
  // appwrite/config.js

  // Add this new method in the Service class
  // Get posts by userId
  async getPostsByUserId(userId) {
    try {
      const posts = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", userId)]
      );
      return posts;
    } catch (error) {
      console.error("Appwrite :: getPostsByUserId Error:", error);
      return { documents: [] };
    }
  }

  // Update an existing post
  async updatePost(slug, data, featuredImage, status) {
    try {
      const { slug: _slug, ...filteredData } = data;
      filteredData.featuredImage = featuredImage;
      filteredData.status = status;

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        filteredData
      );
    } catch (error) {
      console.error("Appwrite :: updatePost Error:", error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.error("Appwrite :: deletePost Error:", error);
      return false;
    }
  }

  // ❌ Removed broken/duplicate getPosts (with wrong variables)
  // ✅ Use this instead to get a single post by ID
  async getPost(slug) {
    try {
      const response = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return response;
    } catch (error) {
      console.error("Appwrite :: getPost Error:", error);
      return null;
    }
  }

  // Upload a file to storage bucket
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
        [Permission.read(Role.any())]
      );
    } catch (error) {
      console.error("Appwrite :: uploadFile Error:", error);
      return null;
    }
  }

  // Delete a file from storage bucket
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite :: deleteFile Error:", error);
      return false;
    }
  }

  // Get direct view URL for a file
  // In config.js
  getFileView(fileId) {
    try {
      return `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}`;
    } catch (error) {
      console.error("Appwrite :: getFileView Error:", error);
      return "";
    }
  }
}

// Export singleton
const service = new Service();
export default service;
