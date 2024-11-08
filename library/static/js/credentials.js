document.getElementById("username").addEventListener("blur", function () {
  const username = this.value;
  const feedback = document.getElementById("username-feedback");
  if (username) {
    fetch(`check-username/?username=${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.exist) {
            feedback.textContent = 'Username is already taken';
            feedback.style.color = 'red';
        }
        else if (data.exist = 'not'){
            feedback.textContent = '';
        }
        
  
      });
  }
});
