export const validListing = function *({
    title,
    description,
}: {
    title: string,
    description: string,
}) {
    if (title.length === 0) {
        yield "Title is empty";
    }

    if (description.length === 0) {
        yield "Description is empty";
    }
};