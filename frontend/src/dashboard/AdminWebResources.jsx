import { useEffect, useState } from "react";


export default function AdminWebResources() {
    const [logo, setLogo] = useState("");
    const [banner, setBanner] = useState("");

    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    useEffect(() => {
        fetch("/admin/websiteresources", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setLogo(data.logo_image || "");
                setBanner(data.banner_image || "");
            })
            .catch(err => console.error(err));
    }, []);

    const uploadImage = async (type, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image_type", type);
        formData.append("image", file);

        try {
            const res = await fetch("/admin/websiteresources", {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                if (type === "logo") {
                    setLogo(data.image_url);
                    setLogoFile(null);
                }

                if (type === "banner") {
                    setBanner(data.image_url);
                    setBannerFile(null);
                }
            } else {
                console.error(data.error || "Upload failed");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="editor-container">
            <h1>Website Resources</h1>

            <div className="editor-card">

                <section className="resource-section">
                    <h2>Logo</h2>

                    {logo && (
                        <div className="resource-preview logo-preview">
                            <img src={logo} alt="Website logo" />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files[0])}
                    />

                    <button
                        onClick={() => uploadImage("logo", logoFile)}
                        disabled={!logoFile}
                    >
                        Upload Logo
                    </button>
                </section>


                <section className="resource-section">
                    <h2>Banner</h2>

                    {banner && (
                        <div className="resource-preview banner-preview">
                            <img src={banner} alt="Website banner" />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBannerFile(e.target.files[0])}
                    />

                    <button
                        onClick={() => uploadImage("banner", bannerFile)}
                        disabled={!bannerFile}
                    >
                        Upload Banner
                    </button>
                </section>

            </div>
        </div>
    );
}