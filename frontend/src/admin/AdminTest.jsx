<button onClick={() => navigate("/admin")} >
    Back to Home
</button>

 const [publishing, setPublishing] = useState(false);
  const handlePublish = async () => {
  setPublishing(true);
 
  try {
    const res = await fetch(
      `/admin/newblogpostpreview/${slug}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Publish failed");
      return;
    }

    localStorage.removeItem("blogDraft");

    alert("Published!");
    navigate("/admin");
  } catch (err) {
    console.error(err);
    alert("Publish failed");
  } finally {
    setPublishing(false);
  }
};


<button 
  onClick={handlePublish} disabled={publishing} style={{ marginLeft: 10 }} >
    {publishing ? "Publishing..." : "Publish"}
</button>

