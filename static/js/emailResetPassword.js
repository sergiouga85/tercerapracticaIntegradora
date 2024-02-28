async function emailResetPassword() {
    const email = document.getElementById('email').value;

    /*const response = await fetch('/api/users/current')
    if (response.status !== 200) {
      alert('necesitas loguearte para ver esta info!')
      return (window.location.href = '/login')
    }

    const result = await response.json()
    const usuario = result.payload

    console.log(usuario.email)

    if(usuario.email != email){
        Swal.fire({
            title: "usuario no existente!",
            icon: "error",
            color: "write"
          });

    }*/
    
    // Hacer una solicitud al backend con el nuevo password

    await fetch(`http://localhost:8080/api/users/forgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Manejar la respuesta del backend
      Swal.fire({
        title: "email sent successfully!",
        icon: "success",
        color: "write"
      });
      document.getElementById('email').value=""
      setTimeout(() => {
        window.location.href = '/login';
      }, "2000");
      
    })
    .catch(error => {
      console.error('Error:', error);
      // Manejar errores
    });
}