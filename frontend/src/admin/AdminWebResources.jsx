import { useEffect, useState } from "react";

export default function AdminWebResources() {
    const [logo, setLogo] = useState("");
    const [banner, setBanner] = useState("");

    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5055/admin/websiteresources", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            setLogo(data.logo_image);
            setBanner(data.banner_image);
        });
    }, []);

    const uploadImage = async (type, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image_type", type);
        formData.append("image", file);

        const res = await fetch("http://localhost:5055/admin/websiteresources", {
            method: "PUT",
            credentials: "include",
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            if (type === "logo") setLogo(data.image_url);
            if (type === "banner") setBanner(data.image_url);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
            <h1>Website Resources</h1>
            <h3>Logo</h3>
            {logo && <img src={logo} style={{ width: "150px" }} />}
            <input
                type="file"
                onChange={(e) => setLogoFile(e.target.files[0])}
            />
            <button onClick={() => uploadImage("logo", logoFile)}>
                Upload Logo
            </button>

            <h3>Banner</h3>
            {banner && <img src={banner} style={{ width: "100%" }} />}
            <input
                type="file"
                onChange={(e) => setBannerFile(e.target.files[0])}
            />
            <button onClick={() => uploadImage("banner", bannerFile)}>
                Upload Banner
            </button>
        </div>
    );
}