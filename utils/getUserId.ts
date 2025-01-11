

function getUserId(): string {


  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = crypto.randomUUID(); // Gera um novo ID único
    localStorage.setItem('userId', userId); // Armazena o ID no localStorage
  }
  return userId;
}

export default getUserId;
