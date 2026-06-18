export function createEmptyBlock(order = 0) {
    return {
        order,

        title_of_block: "",
        content: "",

        alignment: "center",

        url_content_type: null,

        ownership: true,
        name_of_owner: "",

        media_content_url: "",

        image_file: null,
        image_preview_url: null
    };
}