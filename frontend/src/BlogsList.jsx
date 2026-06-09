import { useEffect, useState } from "react";

import "./Components.css";
import "./Styles.css"
import {Layout, PreviewCard} from "./Components.jsx"

function BlogBookList({
    items,
    renderItem
}) {
    return (
        <Layout>
        <div className="preview-list">
            {items.map(renderItem)}
        </div>
        </Layout>
    );
}

export default BlogBookList;