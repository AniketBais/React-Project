import React, {useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '..'
import appwriteService from "../../appwrite/config"
import { useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PostForm({post}) {
  const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      status: post?.status || 'active'
    }
  })
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = React.useState("");
  React.useEffect(() => {
      const loadImage = async () => {
        if (post?.featuredImage) {
          const url = await appwriteService.getFileView(post.featuredImage);
          setImageSrc(url);
        }
      };
      loadImage();
    }, [post]);

  const { userData, status } = useSelector(state => state.auth)
  
  // ⏳ still checking login
  if (status === null) {
  return <p className="text-center mt-10">Checking login...</p>
  }

  // ❌ user not logged in
  if (status === false) {
    return <p className="text-center mt-10">Please login to create post</p>
  }
  

  console.log("REDUX USER =", userData)  // 👈 add this


  const userId = userData?.$id
  const isEdit = !!post;


  //SUBMIT FUNCTION
  const submit = async (data)=>{

  //  make sure user is logged in
  if (!userData || !userData.$id) {
    alert("Please login first");
    return;
  }

  try {

    // ======================================
    // ✏️ UPDATE POST
    // ======================================
    if (post) {
      const file = data.image?.[0]
        ? await appwriteService.uploadFile(data.image[0], userData.$id)
        : null;

      // delete old image if new uploaded
      if (file) {
        await appwriteService.deleteFile(post.featuredImage);
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: file ? file.$id : (post.featuredImage || ""),
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }

      return;
    }

    // ======================================
    // ➕ CREATE POST
    // ======================================
    const file = data.image?.[0]
      ? await appwriteService.uploadFile(data.image[0], userData.$id)
      : null;

    if (!file) {
      alert("Please upload an image");
      return;
    }

    const fileId = file.$id;
    console.log("Uploaded File ID:", fileId);

    const dbPost = await appwriteService.createPost({
      title: data.title,
      slug: data.slug,
      content: data.content,
      status: data.status,
      featuredImage: file.$id,
      userId: userId, // ✅ FIXED (was userData.$id)
    });

    if (dbPost) {
      navigate(`/post/${dbPost.$id}`);
    }

  } catch (error) {
    console.log("Submit error:", error);
    alert("Something went wrong");
  }
};
  
  // AUTO SLUG
  const slugTransform = useCallback((value)=>{
    if(value && typeof value == 'string'){
      return value
                  .trim()
                  .toLowerCase()
                  .replace(/[^\w\s]/g,'') // remove special characters
                  .replace(/\s+/g, '-') // replace spaces with -
                  .replace(/-+/g, '-') //collapse multiple -
    } 
    return ''
  },[])

  React.useEffect(()=>{
    const subscription = watch((value,{name})=>{
      if(name == 'title'){
        setValue('slug',slugTransform(value.title),{shouldValidate: true})
      }
    })


    return ()=>{
      subscription.unsubscribe()
    }
  },[watch, slugTransform,setValue])
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
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
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {isEdit && imageSrc && (
                  <img src={imageSrc} className="rounded-lg mb-4" />
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button 
                        type="submit" 
                        bgColor={post ? "bg-green-500" : undefined} 
                        className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
  )
}
