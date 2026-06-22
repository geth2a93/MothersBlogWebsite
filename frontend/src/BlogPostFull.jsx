import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BlogRender from "./BlogRender";

export default function BlogPostFull() {

    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch(`/api/blog/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!post) {
        return <p>Blog post not found.</p>;
    }

    return (
        <BlogRender
            post={post}
        />
    );
}