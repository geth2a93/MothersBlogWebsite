import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./BlogPostFull.css";
import "./Components.css";
import "./Styles.css"
import {Layout} from "./Components.jsx"


function BlogPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/blog/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]); 

     if (loading) {
        return <p>Loading...</p>; }

    if (!post) {
        return <p>Blog post not found.</p>; }

    const sortedBlocks = [...post?.content_blocks].sort(
        (a, b) => a.order - b.order
    );

    return (
        <Layout>
        <div className="blog-post-page">
            <div className="blog-post-container">
                <h1 className="blog-post-title"> {post.title} </h1>

                {post.preview && (
                    <h2 className="blog-post-preview"> {post.preview} </h2> )}

                {post.title_pic && (
                    <img src={post.title_pic} alt={post.title} className="blog-title-image" />)}

                    {sortedBlocks.map((block) => {
                        const hasImage = Boolean(block.image_url);
                        const hasText = Boolean(block.content);

                        return (
                            <div
                                key={block.order ?? index}
                                className={`blog-block ${block.alignment || "left"}`}
                            >
                                {hasImage && (
                                    <div className={`image-container size-${block.size || 2}`}>
                                        <img src={block.image_url} alt="" className="blog-image"/>
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
    </Layout>
    );  
}

export default BlogPost;