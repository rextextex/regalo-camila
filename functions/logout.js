export async function onRequestPost() {

    const cookie = "__Host-camila_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax";

    return new Response(
        JSON.stringify({
            success: true
        }),
        {
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": cookie
            }
        }
    );
}