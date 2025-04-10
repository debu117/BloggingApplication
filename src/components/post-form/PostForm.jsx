import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [errorMessage, setErrorMessage] = useState("");
  const slugManuallyEdited = useRef(false);
  const [fileName, setFileName] = useState("Choose File");
  const fileInputRef = useRef(null);

  // Transform title to slug (allows spaces now)
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s._-]/g, "") // allow letters, digits, space, period, underscore, hyphen
        .replace(/\s+/g, "-") // replace space(s) with dash
        .replace(/^[^a-z0-9]+/, "") // remove invalid starting chars
        .slice(0, 36); // limit to 36 chars
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && !slugManuallyEdited.current) {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const handleSlugChange = (e) => {
    slugManuallyEdited.current = true;
    setValue("slug", slugTransform(e.target.value), { shouldValidate: true });
  };

  const submit = async (data) => {
    try {
      setErrorMessage("");

      // ✅ Check for userData
      if (!userData || !userData.$id) {
        setErrorMessage("User not authenticated. Please log in.");
        return;
      }

      let fileId = null;
      const { image, ...restData } = data;

      if (image?.[0]) {
        const file = await appwriteService.uploadFile(image[0]);
        if (file) fileId = file.$id;
      }

      if (post) {
        if (
          fileId &&
          post.featuredImage &&
          typeof post.featuredImage === "string"
        ) {
          try {
            await appwriteService.deleteFile(post.featuredImage);
          } catch (error) {
            setErrorMessage(error?.message || "Error deleting previous image.");
          }
        }

        const updatedPost = await appwriteService.updatePost(
          post.$id,
          restData,
          fileId || post.featuredImage,
          restData.status
        );

        if (updatedPost) return navigate(`/post/${updatedPost.$id}`);
      } else {
        const newPost = await appwriteService.createPost({
          ...restData,
          slug: slugTransform(data.slug),
          featuredImage: fileId,
          userId: userData.$id, // ✅ Safe now
        });

        if (newPost) return navigate(`/post/${newPost.$id}`);
      }
    } catch (error) {
      console.error("❌ Error submitting post:", error);
      setErrorMessage(error?.message || "An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {/* Error Message */}
      {errorMessage && (
        <div className="w-full px-2 mb-4">
          <p className="bg-red-100 text-red-800 px-4 py-2 rounded-md font-medium border border-red-300">
            ⚠️ {errorMessage}
          </p>
        </div>
      )}

      {/* Left side */}
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onChange={handleSlugChange}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* Right side */}
      <div className="w-1/3 px-2">
        <div className="mb-4">
          <label className="block text-white font-medium mb-1">
            Featured Image :
          </label>
          <div className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md text-sm w-full flex items-center justify-between">
            <span className="truncate max-w-[70%]">{fileName}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer"
            >
              Browse
            </button>
          </div>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              setFileName(file ? file.name : "Choose File");
              setValue("image", e.target.files, { shouldValidate: true });
            }}
          />
        </div>

        {post?.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={
            post
              ? "bg-green-500 hover:bg-green-400 active:bg-green-500"
              : undefined
          }
          className="w-full hover:bg-blue-700 active:bg-blue-500 cursor-pointer"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
