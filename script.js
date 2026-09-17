async function entrar() {

    const contraseña = document.getElementById("password").value;
    const error = document.getElementById("error");

    try {

        const respuesta = await fetch("/auth", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                password: contraseña
            })
        });

        const resultado = await respuesta.json();

        if (resultado.success) {

            window.location.href = "inicio.html";

        } else {

            error.textContent = "Contraseña incorrecta";

        }

    } catch (e) {

        error.textContent = "No se pudo comprobar la contraseña";

    }
}