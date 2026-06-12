import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./BlogPostFull.css";
import "./Styles.css";

function BlogPost() {
    const { date } = useParams();
    console.log("DATE PARAM:", date);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [imageRatios, setImageRatios] = useState({});

    const handleImageLoad = (e, key) => {
        const img = e.target;
        const ratio = img.naturalWidth / img.naturalHeight;

        setImageRatios((prev) => ({
            ...prev,
            [key]: ratio
        }));
    };
    

     useEffect(() => {
        fetch(`/api/blog/${date}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [date]); 

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!post) {
        return <p>Blog post not found.</p>;
    } 

        

    const sortedBlocks = [...(post.content_blocks || [])].sort(
        (a, b) => a.order - b.order
    );

    return (
        <div className="blog-post-page">
            <div className="blog-post-container">

                <h1 className="blog-post-title"> {post.title}</h1>
                {post.date_created && (
                    <p className="blog-post-date">
                      {new Date(post.date_created).toLocaleDateString()}
                    </p>
                )}

                {post.title_pic && (
                    <img
                        src={post.title_pic}
                        alt={post.title}
                        className="blog-title-image"
                    />
                )}

                {!post.ownership && post.name_of_owner && (
                    <p className="image-attribution">
                        Image courtesy of {post.name_of_owner}
                    </p>
                )}

                {post.preview && (
                    <h2 className="blog-post-preview">
                        {post.preview}
                    </h2>
                )}

                {sortedBlocks.map((block) => {
                    const hasImage = Boolean(block.image_url);
                    const hasText = Boolean(block.content);

                    const ratioKey = `${block.order}-${block.image_url}`;
                    const ratio = imageRatios[ratioKey];

                    return (
                        <div
                            key={block.order}
                            className={`blog-block ${block.alignment || "left"}`}
                        >
                            {hasImage && (
                                <div
                                    className="image-container"
                                    style={{
                                        maxWidth: block.size ? `${block.size}px` : "420px",
                                        flex: ratio > 1.2 ? 1.6 : 1
                                    }}
                                >
                                    <img
                                        src={block.image_url}
                                        alt=""
                                        className="blog-image"
                                        onLoad={(e) =>
                                            handleImageLoad(e, ratioKey)
                                        }
                                    />

                                {!block.ownership && block.name_of_owner && (
                                    <p className="image-attribution">
                                        Image courtesy of {block.name_of_owner}
                                    </p>
                                    )}
                                    
                                </div>
                            )}

                            {hasText && (
                                <div className="text-container">
                                    {block.blocktitle && (
                                        <h2 className="blog-block-title">
                                            {block.blocktitle}
                                        </h2>
                                        
                                    )}
                                    {block.content}
                                </div>
                            )}

                            
                        </div>
                    );
                })}
                {post.tags?.length > 0 && (
  <div className="blog-tags-bottom">
    {post.tags.map((tag, i) => (
      <span key={i} className="tag-pill">
        {tag}
      </span>
    ))}
  </div>
)}
            </div>
        </div>
    );
}

export default BlogPost;