import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./BlogPostFull.css";
import "./Components.css";
import "./Styles.css"

function BlogPost() {
    const { id } = useParams();

    // const [post, setPost] = useState(null);
    // const [loading, setLoading] = useState(true);

    const [post, setPost] = useState({
    title: "Test Blog",
    preview: "This is a preview",
    title_pic: "https://shorturl.at/Gv26i",

    content_blocks: [
        {
            order: 1,
            content: "This is a centered block. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
            image_url: "https://shorturl.at/Gv26i",
            alignment: "center",
            size: 2
        },
        {
            order: 2,
            content: "Image on the left.",
            image_url: "https://shorturl.at/Gv26i",
            alignment: "left",
            size: 2
        },
        {
            order: 3,
            content: "Image on the right.",
            image_url: "https://shorturl.at/Gv26i",
            alignment: "right",
            size: 3
        },

        {
            order: 4,
            content: "Image on the right.",
            image_url: "https://shorturl.at/Gv26i",
            alignment: "right",
            size: 4
        }
    ]
});

    /* useEffect(() => {
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
    }, [id]); */

    /* if (loading) {
        return <p>Loading...</p>;
    }

    if (!post) {
        return <p>Blog post not found.</p>;
    } */

    return (
        <div className="blog-post-page">

            <div className="blog-post-container">

                <h1 className="blog-post-title">
                    {post.title}
                </h1>

                {post.preview && (
                    <h2 className="blog-post-preview">
                        {post.preview}
                    </h2>
                )}

                {post.title_pic && (
                    <img src={post.title_pic} alt={post.title} className="blog-title-image" />
                )}

                {post.content_blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => {

                        const hasImage = Boolean(block.image_url);
                        const hasText = Boolean(block.content);

                        return (
                            <div
                                key={block.order}
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
    );
}

export default BlogPost;