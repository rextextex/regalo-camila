function entrar() {

    const contraseña = document.getElementById("password").value;
    const contraseñaCorrecta = "camila";

    if (contraseña === contraseñaCorrecta) {

        document.getElementById("login").classList.add("oculto");
        document.getElementById("inicio").classList.remove("oculto");

    } else {

        document.getElementById("error").textContent =
            "Contraseña incorrecta";
    }
}