
document.addEventListener('DOMContentLoaded', async function () {
    let userSelect = document.getElementById('userSelect');
    let userPostsDiv = document.getElementById('userPosts');
    let darkModeButton = document.getElementById('darkModeButton');
    let body = document.body;
    let cards = document.querySelectorAll('.card');

    darkModeButton.addEventListener('click', function () {
        // Cambiar clase para el modo oscuro
        body.classList.toggle('dark-mode');

        // Cambiar clase para las tarjetas en modo oscuro
        cards.forEach(card => {
            card.classList.toggle('dark-card');
        });
    });

    try {
        // Realizar la solicitud GET para obtener la lista de usuarios
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        // Generar las opciones del desplegable con los nombres de los usuarios
        users.forEach(user => {
            let option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error:', error);
    }

    userSelect.addEventListener('change', async function () {
        let userId = userSelect.value;

        if (userId !== "") {
            try {
                // Realizar la solicitud GET para obtener la información del usuario y sus posts
                const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}?_embed=posts`);
                const data = await userResponse.json();

                userPostsDiv.innerHTML = ''; // Limpiar los divs de posteo existentes

                // Crear un div de posteo para cada post del usuario
                for (const post of data.posts) {
                    let postDiv = document.createElement('div');
                    postDiv.classList.add('card', 'mb-3');
                    postDiv.innerHTML = `
                        <div class="card-body">
                            <p class="card-text"><b>${data.username}</b> <em>${data.email}</em></p>
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>

                            <div class="comments" style="display: none;"></div>

                            <div class="d-flex justify-content-between mt-2">
                                <button type="button" class="btn btn-light rounded-circle toggle-comments">
                                    <img src="media/chat.svg" style="width: 15px; height: 15px;">
                                </button>
                                <button type="button" class="btn btn-light rounded-circle">
                                    <img src="media/arrow-down-up.svg" alt="Boton RT" style="width: 15px; height: 15px;">
                                </button>
                                <button type="button" class="btn btn-light rounded-circle">
                                    <img src="media/heart.svg" alt="Boton like" style="width: 15px; height: 15px;">
                                </button>
                                <button type="button" class="btn btn-light rounded-circle">
                                    <img src="media/eye.svg" alt="Boton views" style="width: 15px; height: 15px;">
                                </button>
                                <button type="button" class="btn btn-light rounded-circle">
                                    <img src="media/upload.svg" alt="Boton compartir" style="width: 15px; height: 15px;">
                                </button>
                            </div>
                        </div>`;

                    userPostsDiv.appendChild(postDiv);

                    // Obtener el botón y el div de comentarios dentro de esta tarjeta de post
                    let toggleButton = postDiv.querySelector('.toggle-comments');
                    let commentsDiv = postDiv.querySelector('.comments');

                    // Agregar evento click al botón para cargar y mostrar los comentarios
                    toggleButton.addEventListener('click', async () => {
                        if (commentsDiv.style.display === 'none') {
                            try {
                                // Realizar la solicitud GET para obtener los comentarios del post
                                const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
                                const comments = await commentsResponse.json();

                                // Crear elemento para mostrar los comentarios
                                let commentsList = document.createElement('ul');
                                commentsList.classList.add('list-group');

                                // Agregar comentarios
                                comments.forEach(comment => {
                                    let commentItem = document.createElement('li');
                                    commentItem.classList.add('list-group-item');
                                    commentItem.textContent = `--${comment.email}-- ${comment.body}`;
                                    commentsList.appendChild(commentItem);
                                });

                                commentsDiv.style.display = 'block';
                                commentsDiv.appendChild(commentsList);
                                toggleButton.innerHTML = '<img src="media/chat.svg" style="width: 15px; height: 15px;">';
                            } catch (error) {
                                console.error('Error fetching comments:', error);
                            }
                        } else {
                            // Ocultar los comentarios
                            commentsDiv.style.display = 'none';
                            commentsDiv.innerHTML = '';
                            toggleButton.innerHTML = '<img src="media/chat.svg" style="width: 15px; height: 15px;">';
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching user data and posts:', error);
            }
        } else {
            userPostsDiv.innerHTML = '';
        }
    });
});
