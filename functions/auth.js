async function crearFirma(texto, secreto) {

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secreto),
        {
            name: "HMAC",
            hash: "SHA-256"
        },
        false,
        ["sign"]
    );

    const firma = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(texto)
    );

    return Array.from(new Uint8Array(firma))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


export async function onRequestPost(context) {

    const datos = await context.request.json();

    const contraseña = datos.password;

    if (contraseña !== context.env.PASSWORD) {

        return new Response(
            JSON.stringify({
                success: false
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }


    const contenido = "camila-authenticated";


    const firma = await crearFirma(
        contenido,
        context.env.PASSWORD
    );


    const cookie =
        `__Host-camila_session=${contenido}.${firma}; ` +
        `Max-Age=315360000; ` +
        `Path=/; ` +
        `HttpOnly; ` +
        `Secure; ` +
        `SameSite=Lax`;


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