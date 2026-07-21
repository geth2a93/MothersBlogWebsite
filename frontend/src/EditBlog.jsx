import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  InstagramEmbed,
  FacebookEmbed,
  YouTubeEmbed,
  XEmbed
} from "react-social-media-embed";


const createEmptyBlock = (order = 0) => ({
  order,
  title_of_block: "",
  content: "",
  alignment: "center",

  url_content_type: "none",
  media_content_url: "",

  file: null,
  preview_url: null,

  ownership: {
    is_owner: true,
    name: ""
  }
});

const normalizeBlog = (data) => {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title || "",
    preview: data.preview || "",
    publish_date:
      data.date_created
        ? data.date_created.slice(0,16)
        : "",
    tags: data.tags || [],
    status:
      data.published
        ? "published"
        : "draft",

    title_media: {
      type:
        data.url_content_type || "none",

      url:
        data.url_content_type !== "image"
          ? data.title_media || ""
          : "",

      preview_url:
        data.url_content_type === "image"
          ? data.title_media
          : null,

      file:null,

      ownership:{
        is_owner:
          data.ownership === true ||
          data.ownership === "true",
        name:
          data.name_of_owner || ""
      }
    },

    content_blocks:

      (data.content_blocks || [])
      .map(block => ({
        order:block.order,
        title_of_block:
          block.blocktitle || "",

        content:
          block.content || "",

        alignment:
          block.alignment || "center",

        url_content_type:
          block.url_content_type || "none",
          
        media_content_url:
          block.media_content_url || "",
        file:null,

        preview_url:
          block.url_content_type === "image"
            ? block.media_content_url
            : null,

        ownership:{
          is_owner:
            block.ownership === true ||
            block.ownership === "true",

          name:
            block.name_of_owner || ""
        }
      }))
  };
};


const renderMedia = (
  type,
  url,
  preview
) =>{

  if(type === "image" && preview){

    return (
      <img
        src={preview} width="300" alt="media" />
    );

  }

  if(type === "youtube"){
    return (
      <YouTubeEmbed url={url} width="100%" />
    );
  }

  if(type === "instagram"){
    return (
      <InstagramEmbed url={url} width="100%" />
    );
  }

  if(type === "facebook"){
    return (
      <FacebookEmbed url={url} width="100%" />
    );
  }

  if(type === "threads"){
    return (
      <XEmbed url={url} width="100%" />
    );
  }
  return null;

};

export default function EditBlog(){
  const {slug}=useParams();
  const navigate=useNavigate();

  const [blog,setBlog]=useState(null);
  const [loading,setLoading]=useState(true);
  const [tagInput,setTagInput]=useState("");

  useEffect(()=>{
    const loadBlog=async()=>{
      try{
        const res=await fetch(
          `http://localhost:5055/admin/editblog/${slug}`,
          {
            credentials:"include"
          }
        );


        const data=await res.json();
        setBlog(
          normalizeBlog(data)
        );

        console.log(
  normalizeBlog(data).content_blocks
);


      } catch(err){
        console.error(
          "Failed loading blog:",
          err
        );
      }
      finally{
        setLoading(false);
      }
    };
    loadBlog();

  },[slug]);

  const updateBlog=(field,value)=>{
    setBlog(prev=>({
      ...prev,
      [field]:value
    }));
  };

  const addTag=()=>{
    const tag=tagInput.trim();
    if(!tag)
      return;

    if(blog.tags.includes(tag))
      return;

    setBlog(prev=>({
      ...prev,
      tags:[
        ...prev.tags,
        tag
      ]
    }));
    setTagInput("");

  };

  const removeTag=(tag)=>{
    setBlog(prev=>({
      ...prev,
      tags:
        prev.tags.filter(
          t=>t!==tag
        )
    }));

  };

  const updateBlock=(index,updated)=>{
    setBlog(prev=>{
      const blocks=[
        ...prev.content_blocks
      ];
      blocks[index]=updated;

      return {
        ...prev,
        content_blocks:blocks
      };
    });
  };

  const addBlock=()=>{
    setBlog(prev=>({
      ...prev,
      content_blocks:[

        ...prev.content_blocks,
        createEmptyBlock(
          prev.content_blocks.length
        )

      ]
    }));
  };

  const removeBlock=(index)=>{
    setBlog(prev=>({
      ...prev,
      content_blocks:

        prev.content_blocks.filter(
          (_,i)=>i!==index
        )
    }));
  };

  const updateBlockField = (index, field, value) => {
  updateBlock(index, {
    ...blog.content_blocks[index],
    [field]: value
  });
};

const updateBlockOwnership = (index, field, value) => {
  updateBlock(index, {
    ...blog.content_blocks[index],
    ownership: {
      ...blog.content_blocks[index].ownership,
      [field]: value
    }
  });
};

const handleBlockImage = (index, e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  updateBlock(index, {
    ...blog.content_blocks[index],
    file,
    preview_url: URL.createObjectURL(file)
  });
};

const updateHero = (field, value) => {
  setBlog(prev => ({
    ...prev,
    title_media: {
      ...prev.title_media,
      [field]: value
    }
  }));
};

const updateHeroOwnership = (field, value) => {
  setBlog(prev => ({
    ...prev,
    title_media: {
      ...prev.title_media,
      ownership: {
        ...prev.title_media.ownership,
        [field]: value
      }
    }
  }));
};


const buildFormData=()=>{
    const formData=new FormData();

    formData.append(
      "blog_id",
      blog.id
    );

    formData.append(
      "title",
      blog.title
    );

    formData.append(
      "preview",
      blog.preview
    );

    formData.append(
      "date",
      blog.publish_date
    );

    blog.tags.forEach(tag=>{
      formData.append(
        "tags",
        tag
      );
    });

    formData.append(
      "title_url_content_type",
      blog.title_media.type
    );

    if(
      blog.title_media.type==="image"
    ){

      formData.append(
        "ownership",

        blog.title_media.ownership.is_owner
          ?"true"
          :"false"
      );


      formData.append(
        "name_of_owner",
        blog.title_media.ownership.name
      );


      if(blog.title_media.file){
        formData.append(
          "title_image",
          blog.title_media.file
        );
      }
    }

    if(
      [
        "youtube",
        "instagram",
        "facebook",
        "threads"

      ].includes(
        blog.title_media.type
      )

    ){

      formData.append(
        "title_media_content_url",
        blog.title_media.url
      );
    }

    const blocks =
      blog.content_blocks.map(
        (block,index)=>({
          order:index,

          title_of_block:
            block.title_of_block,

          content:
            block.content,

          alignment:
            block.alignment,

          url_content_type:
            block.url_content_type,

          media_content_url:
            block.media_content_url,

          ownership:
            block.ownership.is_owner
              ?"true"
              :"false",

          name_of_owner:
            block.ownership.name

        })
      );

    formData.append(
      "content_blocks",
      JSON.stringify(blocks)
    );

    blog.content_blocks.forEach(
      (block,index)=>{

        if(
          block.url_content_type==="image" &&
          block.file
        ){

          formData.append(
            `image_${index}`,
            block.file
          );
        }
      }
    );
    return formData;
  };

  const handleSave = async () => {
  const formData = buildFormData();

  console.log("FORM DATA");

  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            size: value.size,
            type: value.type
          }
        : value
    );
  }

  const res = await fetch(
    `http://localhost:5055/admin/editblog/${slug}`,
    {
      method: "PUT",
      credentials: "include",
      body: formData
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Save failed");
    return;
  }

  alert("Saved!");
  navigate("/admin/blogs");
};  


  if(loading){

    return (
      <div className="admin-container">

        <h2>
          Loading blog...
        </h2>

      </div>
    );

  }

  return (
    <div className="admin-container">
      <h1>
        Edit Blog
      </h1>

      <div className="admin-card">
        <input

          value={blog.title}
          onChange={
            e=>updateBlog(
              "title",
              e.target.value
            )
          }

        />

        <textarea
          value={blog.preview}
          onChange={
            e=>updateBlog(
              "preview",
              e.target.value
            )
          }
        />

        <h2>Publishing Date</h2>

<input
  type="datetime-local"
  value={blog.publish_date}
  onChange={(e) =>
    updateBlog("publish_date", e.target.value)
  }
/>

        <h2>Title Media</h2>

<select
  value={blog.title_media.type || "none"}
  onChange={(e) =>
    updateHero("type", e.target.value)
  }
>
  <option value="none">None</option>
  <option value="image">Image</option>
  <option value="youtube">Youtube</option>
  <option value="instagram">Instagram</option>
  <option value="facebook">Facebook</option>
  <option value="threads">Threads</option>
</select>

{["youtube","instagram","facebook","threads"].includes(
  blog.title_media.type
) && (
  <input
    placeholder="Paste link"
    value={blog.title_media.url}
    onChange={(e)=>
      updateHero("url", e.target.value)
    }
  />
)}

{blog.title_media.type==="image" && (
<>
    {blog.title_media.preview_url && (
        <img
            src={blog.title_media.preview_url}
            width="300"
            alt=""
        />
    )}

    <input
        type="file"
        accept="image/*"
        onChange={(e)=>{
            const file=e.target.files?.[0];
            if(!file) return;

            setBlog(prev=>({
                ...prev,
                title_media:{
                    ...prev.title_media,
                    file,
                    preview_url:URL.createObjectURL(file)
                }
            }));
        }}
    />

    <select
        value={
            blog.title_media.ownership.is_owner
            ? "true"
            : "false"
        }
        onChange={(e)=>
            updateHeroOwnership(
                "is_owner",
                e.target.value==="true"
            )
        }
    >
        <option value="true">Mine</option>
        <option value="false">Other</option>
    </select>

    {!blog.title_media.ownership.is_owner && (
        <input
            placeholder="Owner"
            value={blog.title_media.ownership.name}
            onChange={(e)=>
                updateHeroOwnership(
                    "name",
                    e.target.value
                )
            }
        />
    )}
</>
)}

        <h2>
          Content Blocks
        </h2>

        {blog.content_blocks.map((block, index) => (
  <div key={index} className="admin-container">
    <input
      placeholder="Block title"
      value={block.title_of_block}
      onChange={(e) =>
        updateBlockField(index, "title_of_block", e.target.value)
      }
    />

    <textarea
      placeholder="Content"
      value={block.content}
      onChange={(e) =>
        updateBlockField(index, "content", e.target.value)
      }
    />

    <select
      value={block.alignment}
      onChange={(e) =>
        updateBlockField(index, "alignment", e.target.value)
      }
    >
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
    </select>

    <select
      value={block.url_content_type || "none"}
      onChange={(e) =>
        updateBlock(index, {
          ...block,
          url_content_type: e.target.value
        })
      }
    >
      <option value="none">None</option>
      <option value="image">Image</option>
      <option value="youtube">Youtube</option>
      <option value="instagram">Instagram</option>
      <option value="facebook">Facebook</option>
      <option value="threads">Threads</option>
    </select>

    {["youtube", "instagram", "facebook", "threads"].includes(
      block.url_content_type
    ) && (
      <input
        placeholder="Paste link"
        value={block.media_content_url}
        onChange={(e) =>
          updateBlockField(index, "media_content_url", e.target.value)
        }
      />
    )}

    {block.url_content_type === "image" && (
      <>
        {block.preview_url && (
          <img
            src={block.preview_url}
            width="200"
            alt=""
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleBlockImage(index, e)}
        />

        <select
          value={block.ownership.is_owner ? "true" : "false"}
          onChange={(e) =>
            updateBlockOwnership(
              index,
              "is_owner",
              e.target.value === "true"
            )
          }
        >
          <option value="true">Mine</option>
          <option value="false">Other</option>
        </select>

        {!block.ownership.is_owner && (
          <input
            placeholder="Owner name"
            value={block.ownership.name}
            onChange={(e) =>
              updateBlockOwnership(
                index,
                "name",
                e.target.value
              )
            }
          />
        )}
      </>
    )}
    

    <button onClick={() => removeBlock(index)}>
      Delete Block
    </button>
  </div>
))}

        <h2> Tags </h2>

        <input
          value={tagInput}
          onChange={
            e=>setTagInput(
              e.target.value
            )
          }
        />

        <button onClick={addTag}>
          Add
        </button>

        <div>
        { blog.tags.map(tag=>(
            <span
              key={tag}
              onClick={
                ()=>removeTag(tag)
              }

              style={{
                cursor:"pointer",
                marginRight:10
              }}
            >

              {tag} ✕
            </span>

          ))
        }

        </div>

        <button onClick={addBlock}>
          Add Block
        </button>

        <button onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}