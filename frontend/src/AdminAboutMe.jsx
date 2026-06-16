import { useEffect, useState } from "react";

export default function AdminAboutMe(){
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

     useEffect(() => {
        fetch("http://localhost:5055/admin/editaboutme", {
            credentials: "include"
        })
        .then(res => res.json())
            .then(data => {
                setContent(data.content || "");
                setPreview(data.abtme_pic_url || "");
            })
            .catch(err => console.error(err));
        }, []);

        const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
            }
        };

        const handleSave = async () => {
            setLoading(true);
            setMessage("");

        try {
            const formData = new FormData();
            formData.append("content", content);

            if (image) {
                formData.append("image", image);
            }

            const res = await fetch("http://localhost:5055/admin/editaboutme", {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Updated successfully");
                setPreview(data.abtme_pic_url);
            } else {
                setMessage(data.error || "Update failed");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
            <h1>Admin About Me</h1>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                style={{ width: "100%" }}
            />

            <input type="file" accept="image/*" onChange={handleImageChange} />

            {preview && (
                <div>
                    <p>Preview:</p>
                    <img
                        src={preview}
                        alt="preview"
                        style={{ width: "200px", marginTop: "10px" }}
                    />
                </div>
            )}
            <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>

            {message && <p>{message}</p>}
        </div>
        );
    };
