// const apiUrl = "https://ass2-server.herokuapp.com/";
const apiUrl = "http://localhost:5000/";

var loggedUser=null


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

function goToViewRecipe(id){
    $("body").pagecontainer("change", "#recipeView");
}

function goToEditRecipe(id){
    $("body").pagecontainer("change", "#recipeEdit");
}

function goToLogin(id){
    $("body").pagecontainer("change", "#login");
}


function goToHome(){
    $("body").pagecontainer("change", "#home");
}

function goToEdit(){
    $("body").pagecontainer("change", "#edit");
}

function viewImage(url){
  console.log(cordova);
    PhotoViewer.show('static/Chicken_Noodle_Soup.jpg', 'Optional Title');
}


function setUpLogin() {
  $("#registerForm").validate({
    rules: {
      registerInputName: {
        required: true,
      },
      registerInputEmail: {
        required: true
      },
      registerPassword: {
        required: true,
      },
    },
  })
  $("#loginForm").on('submit', async function (e) {
    //prevent default
    e.preventDefault();
    var isvalid = $("#registerForm").valid();
    // console.log(isvalid)
    if (isvalid) {

      let loginInputEmail = $("#loginInputEmail").val()
      let loginPassword  = $("#loginPassword ").val()

      const  user= { email: loginInputEmail, password: loginPassword};
      try {
        let data = await $.ajax({
          url: apiUrl + "user/login",
          type: "post",
          contentType: "application/json",
          data: JSON.stringify(user),
        });
        // console.log(data)
        loggedUser=data
        alert("Sign in successfully")
        goToHome()
        updateProfile()
      } catch (e) {
        if(e.status!=200){
          alert(e.responseText)
        }
        // console.log()
      }

    }
  });

}

function setUpRegister() {
  $("#registerForm").validate({
    rules: {
      registerInputName: {
        required: true,
      },
      registerInputEmail: {
        required: true
      },
      registerPassword: {
        required: true,
      },
    },
  })
  $("#registerForm").on('submit', async function (e) {
    //prevent default
    e.preventDefault();
    var isvalid = $("#registerForm").valid();
    // console.log(isvalid)
    if (isvalid) {

      let registerInputName = $("#registerInputName").val()
      let registerInputEmail = $("#registerInputEmail ").val()
      let registerPassword = $("#registerPassword").val()

      const newUser= { name: registerInputName,email: registerInputEmail, password: registerPassword };
      try {
        let data = await $.ajax({
          url: apiUrl + "user/register",
          type: "post",
          contentType: "application/json",
          data: JSON.stringify(newUser),
        });
        alert("Register successfully")
        goToLogin()
        // return data;
      } catch (e) {
        alert(e.responseText)
        // console.log()
      }

    }
  });

}

function updateProfile(){
  $("#profileName").text(loggedUser.name)
  $("#profileEmail").text(loggedUser.email)

}

$(document).on("pagecreate", "#home", function () {
  const gallery = new Viewer(document.getElementById('images'));



  // $("#submitRegistration").click(()=>{
  //   console.log("h")

  // })


});


setUpRegister()
setUpLogin()