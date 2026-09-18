export async function onRequestGet(context) {

    const url = new URL(context.request.url);

    const ruta = url.pathname;

    const prefijo = "/fotos/";

    if (!ruta.startsWith(prefijo)) {

        return new Response(
            "Ruta no válida",
            {
                status: 400
            }
        );
    }


    const archivo = ruta
        .substring(prefijo.length);


    if (!archivo) {

        return new Response(
            "Archivo no especificado",
            {
                status: 400
            }
        );
    }


    const objeto =
        await context.env.BUCKET.get(archivo);


    if (!objeto) {

        return new Response(
            "Foto no encontrada",
            {
                status: 404
            }
        );
    }


    const headers = new Headers();

    objeto.writeHttpMetadata(headers);

    headers.set(
        "etag",
        objeto.httpEtag
    );

    headers.set(
        "Cache-Control",
        "private, max-age=3600"
    );


    return new Response(
        objeto.body,
        {
            headers
        }
    );
}