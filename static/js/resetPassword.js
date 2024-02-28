function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    console.log(newPassword);
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token =document.getElementById('token').value;

    // Validar que las contraseñas coincidan (puedes hacer esto en el frontend)
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Hacer una solicitud al backend con el nuevo password

    fetch(`http://localhost:8080/api/users/resetPassword/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Manejar la respuesta del backend
      Swal.fire({
        title: "updated password!",
        icon: "success",
        color: "write"
      });
      document.getElementById('newPassword').value=""
      document.getElementById('confirmPassword').value=""
      setTimeout(() => {
        window.location.href = '/login';
      }, "2000");
    })
    .catch(error => {
      console.error('Error:', error);
      // Manejar errores
    });
}