export const validUsername = function* ({
    name,
}: {
    name: string;
}) {
    if (name.length === 0) {
        yield "Username is required";
    }

    if (name.length < 2) {
        yield "Username must be at least 2 characters long";
    }

    if (name.length > 64) {
        yield "Username must be no more than 30 characters long";
    }

    const validCharacterPattern = /^[a-zA-Z0-9_\-]+( [a-zA-Z0-9_\-]+)*$/;
    if (!validCharacterPattern.test(name)) {
        yield "Username failed pattern match";
    }
};
