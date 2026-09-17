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


async function comprobarSesion(request, secreto) {

    const cookies = request.headers.get("Cookie") || "";

    const encontrado = cookies
        .split(";")
        .map(cookie => cookie.trim())
        .find(cookie =>
            cookie.startsWith("__Host-camila_session=")
        );

    if (!encontrado) {
        return false;
    }

    const valor = encontrado.split("=")[1];

    if (!valor) {
        return false;
    }

    const partes = valor.split(".");

    if (partes.length !== 2) {
        return false;
    }

    const contenido = partes[0];
    const firma = partes[1];

    if (contenido !== "camila-authenticated") {
        return false;
    }

    const firmaCorrecta = await crearFirma(
        contenido,
        secreto
    );

    return firma === firmaCorrecta;
}


export async function onRequest(context) {

    const url = new URL(context.request.url);

    const ruta = url.pathname;

    // Rutas públicas
    if (
        ruta === "/" ||
        ruta === "/index.html" ||
        ruta === "/auth" ||
        ruta === "/logout" ||
        ruta === "/estilo.css" ||
        ruta === "/script.js" ||
        ruta.startsWith("/imagenes/")
    ) {
        return context.next();
    }

    const sesionValida = await comprobarSesion(
        context.request,
        context.env.PASSWORD
    );

    if (!sesionValida) {

        return Response.redirect(
            new URL("/", context.request.url),
            302
        );
    }

    return context.next();
}