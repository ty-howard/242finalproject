const showEmailResult = async(e) => {
    e.preventDefault();
  
    const result = document.getElementById("conf");
    result.innerHTML = "Please wait....";
  
    let response = await getEmailResult();
  
    if(response.status == 200){
        result.innerHTML = "Email successfully sent";
    } else {
        result.innerHTML = "Sorry, your email was not sent";
    }

    // Reset the form after a delay
    setTimeout(() => {
        const form = document.getElementById("contact-form");
        form.reset();
    }, 3000);

    // Hide the confirmation message after a delay
    setTimeout(() => {
        result.innerHTML = "";
    }, 3000);
};

  
  const getEmailResult = async() => {
    const form = document.getElementById("contact-form");
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    const result = document.getElementById("conf");
    result.innerHTML = "Please wait....";
  
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                Accept:"application/json"
            },
            body:json
        });
  
        return response;
    } catch(error){
        console.log(error);
        result.innerHTML = "Sorry, your email couldn't be sent";
    }
  };
  
  document.getElementById("contact-form").onsubmit = showEmailResult;