import React from "react";

function Register() {
  return (
    <>
      <form action="/procesar" method="POST">
        <label htmlFor="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required />

        <label htmlFor="contraseña">Contraseña:</label>
        <input type="contraseña" id="contraseña" name="contraseña" required />

        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

export default Register;
