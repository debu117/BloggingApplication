const conf = {
  appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  appwriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  apiKey: import.meta.env.VITE_TINYMCE_API_KEY, // ✅ Load from .env
};

export default conf;
