export async function onRequestPost(context) {

    const datos = await context.request.json();

    const contraseña = datos.password;

    if (contraseña === context.env.PASSWORD) {

        return new Response(
            JSON.stringify({
                success: true
            }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }

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