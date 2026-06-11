import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./BlogPostFull.css";
import "./Styles.css";

function BlogPost() {
    const { id } = useParams();

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
        fetch(`/api/blog/${id}`)
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
    }, [id]); 

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

                <h1 className="blog-post-title">{post.title}</h1>

                {post.preview && (
                    <h2 className="blog-post-preview">
                        {post.preview}
                    </h2>
                )}

                {post.title_pic && (
                    <img
                        src={post.title_pic}
                        alt={post.title}
                        className="blog-title-image"
                    />
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
                                            handleImageLoad(
                                                e,
                                                ratioKey
                                            )
                                        }
                                    />
                                </div>
                            )}

                            {hasText && (
                                <div className="text-container">
                                    {block.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BlogPost;