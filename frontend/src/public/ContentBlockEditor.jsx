import React from "react";

export default function ContentBlockEditor({
    block,
    index,
    updateBlock,
    removeBlock
}) {

    const handleChange = (field, value) => {
        updateBlock(index, {
            ...block,
            [field]: value
        });
    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        handleChange("image_file", file);
        handleChange(
            "image_preview_url",
            URL.createObjectURL(file)
        );
    };

    return (
        <div className="content-block-editor">

            <h3>Block #{index + 1}</h3>

            <input
                type="text"
                placeholder="Block Title"
                value={block.title_of_block}
                onChange={(e) =>
                    handleChange(
                        "title_of_block",
                        e.target.value
                    )
                }
            />

            <textarea
                placeholder="Content"
                value={block.content}
                onChange={(e) =>
                    handleChange(
                        "content",
                        e.target.value
                    )
                }
            />

            <label>
                Alignment
            </label>

            <select
                value={block.alignment}
                onChange={(e) =>
                    handleChange(
                        "alignment",
                        e.target.value
                    )
                }
            >
                <option value="left">
                    Left
                </option>

                <option value="center">
                    Center
                </option>

                <option value="right">
                    Right
                </option>
            </select>

            <label>
                Media Type
            </label>

            <select
                value={block.url_content_type || ""}
                onChange={(e) =>
                    handleChange(
                        "url_content_type",
                        e.target.value || null
                    )
                }
            >
                <option value="">
                    None
                </option>

                <option value="image">
                    Image
                </option>

                <option value="youtube">
                    Youtube
                </option>

                <option value="instagram">
                    Instagram
                </option>

                <option value="facebook">
                    Facebook
                </option>

                <option value="threads">
                    Threads
                </option>
            </select>

            {block.url_content_type === "image" && (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                    {block.image_preview_url && (
                        <img
                            src={
                                block.image_preview_url
                            }
                            alt=""
                            width="200"
                        />
                    )}
                </>
            )}

            {block.url_content_type &&
                block.url_content_type !==
                    "image" && (
                    <input
                        type="text"
                        placeholder="Media URL"
                        value={
                            block.media_content_url
                        }
                        onChange={(e) =>
                            handleChange(
                                "media_content_url",
                                e.target.value
                            )
                        }
                    />
                )}

            <label>
                Ownership
            </label>

            <select
                value={
                    block.ownership
                        ? "true"
                        : "false"
                }
                onChange={(e) =>
                    handleChange(
                        "ownership",
                        e.target.value === "true"
                    )
                }
            >
                <option value="true">
                    Mine
                </option>

                <option value="false">
                    Other
                </option>
            </select>

            {!block.ownership && (
                <input
                    type="text"
                    placeholder="Owner Name"
                    value={
                        block.name_of_owner
                    }
                    onChange={(e) =>
                        handleChange(
                            "name_of_owner",
                            e.target.value
                        )
                    }
                />
            )}

            <button
                type="button"
                onClick={() =>
                    removeBlock(index)
                }
            >
                Remove Block
            </button>

        </div>
    );
}