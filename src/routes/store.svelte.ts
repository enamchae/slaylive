export const store = $state({
    userId: <string | null>null,
    userName: <string | null>null,
    userToken: <string | null>null,
    accessToken: <string | null>null,
});


export const authHeader = () => `Basic ${store.accessToken}`;