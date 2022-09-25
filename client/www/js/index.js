const apiUrl = "http://localhost:5000/";
//const apiUrl = "https://coit20269ass32022.herokuapp.com/";

var loggedUser = null
var editRecipe = null

function getFileSrc(name) {
  return apiUrl + "uploads/" + name
}


document.addEventListener("deviceready", onDeviceReady, false);

function isLoggedIn() {
  if (!loggedUser) {
    try {
      userStr = localStorage.getItem("loggedUser")
      console.log(userStr)
      savedUser = JSON.parse(userStr)
    }
    catch (e) {
      console.log(e)
      return goToLogin()
    }
    if (savedUser) {
      loggedUser = savedUser
    }
    else {
      goToLogin()
    }
  }
}
function persistentUser(user) {
  loggedUser = user
  if(!loggedUser){
    console.log(user)
  }
  localStorage.setItem("loggedUser", JSON.stringify(loggedUser))
}


function onDeviceReady() {
}

async function updateViewRecipe(id) {
  try {
    let data = await $.ajax({
      url: apiUrl + "recipe/" + id,
      type: "GET",
      contentType: "application/json",
    });
    var recipe = data

  } catch (e) {
    return alert(e.responseText)
  }

  $("#viewImage").attr("src", getFileSrc(recipe.image))
  $("#viewVideo").attr("src", getFileSrc(recipe.video))
  $("#viewTitle").text(recipe.title)
  $("#viewContent").text(recipe.content)

  console.log(recipe)
  try {
    let data = await $.ajax({
      url: apiUrl + "user/basic/" + recipe.createBy,
      type: "GET",
      contentType: "application/json",
    });
    var author = data
  } catch (e) {
    return alert(e.responseText)
  }

  $("#viewCreatedBy").text(author.name)
  $("#createdBy").attr("src",getFileSrc(author.avatar))




}

function goToViewRecipe(id) {
  $("body").pagecontainer("change", "#recipeView");
  updateViewRecipe(id)
}

async function updateEditRecipe(id) {
  try {
    let data = await $.ajax({
      url: apiUrl + "recipe/" + id,
      type: "GET",
      contentType: "application/json",
    });
    editRecipe = data


  } catch (e) {
    return alert(e.responseText)
  }

  $("#editTitle").val(editRecipe.title)
  $("#editContent").text(editRecipe.content)


  $("#editImage").attr("src", getFileSrc(editRecipe.image))
  $("#editVideo").attr("src", getFileSrc(editRecipe.video))
  $("#chooseImage").val('')
  $("#chooseVideo").val('')

}

async function updateProfile() {
  $(".avatar img").attr("src", getFileSrc(loggedUser.avatar))
  $("#profileName").text(loggedUser.name)
  $("#profileEmail").text(loggedUser.email)

}

function goToEditRecipe(id) {
  updateEditRecipe(id);
  $("body").pagecontainer("change", "#recipeEdit");
}

function goToProfile() {
  updateProfile()
  $("body").pagecontainer("change", "#profile");
}


function goToLogin(id) {
  $("body").pagecontainer("change", "#login");
}

async function updateHome() {
  try {
    let data = await $.ajax({
      url: apiUrl + "recipe/all",
      type: "GET",
    });

    var recipeList = data
  }
  catch (e) {
    return alert(e.responseText)
  }

  let innerHtml = ""
  for (let recipe of recipeList) {
    let imgSrc = getFileSrc(recipe.image)
    innerHtml += `
                <li>
                    <div class="card">
                        <img src="${imgSrc}" />
                        <div class="text">
                            <a onclick="goToViewRecipe('${recipe._id}')">${recipe.title}</a>
                            <p>${recipe.content}
                            </p>
                        </div>
                    </div>
                </li>
      `
  }
  $("#homeList").html(innerHtml).enhanceWithin()
  $("#homeList").listview('refresh')

}

function goToHome() {
  $("body").pagecontainer("change", "#home");
  updateHome()
}

function goToEditList() {
  $("body").pagecontainer("change", "#editList");
  updateEditList();
}

async function updateEditList() {
  try {
    let data = await $.ajax({
      url: apiUrl + "recipe/editList",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userId: loggedUser._id }),
    });
    let editRecipeList = data
    let innerHtml = ""
    for (let recipe of editRecipeList) {
      let imageSrc = getFileSrc(recipe.image)
      // console.log(recipe)
      innerHtml += `
                    <div class="card">
                        <img src="${imageSrc}" onclick="editRecipe(1)" />
                        <div class="text">
                          <a onclick="goToEditRecipe('${recipe._id}')">${recipe.title}</a>
                          <p>${recipe.content}</p>
                        </div>
                      <div>
                        <button data-role="button" data-inline="true" data-mini="true" onclick="deleteRecipe('${recipe._id}')">DELETE</button>
                      </div>
                    </div>
      `
    }
    $("#recipeEditList").html(innerHtml).enhanceWithin()

  } catch (e) {
    // if (e.status != 200) {
    alert(e.responseText)
    // }
    // console.log()
  }

}

function viewImage(url) {
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
      let loginPassword = $("#loginPassword ").val()

      const user = { email: loginInputEmail, password: loginPassword };
      try {
        let data = await $.ajax({
          url: apiUrl + "user/login",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(user),
        });
        persistentUser(data)
        console.log(loggedUser)
        alert("Sign in successfully")
        goToHome()
        updateProfile()
      } catch (e) {
        // if (e.status != 200) {
        alert(e.responseText)
        // }
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

      const newUser = { name: registerInputName, email: registerInputEmail, password: registerPassword, avatar: '' };
      try {
        let data = await $.ajax({
          url: apiUrl + "user/register",
          type: "POST",
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

function setUpHome() {
  $(".homeMenu").click(() => {
    goToHome()
  })
}
function setUpEditList() {
  $(".editListMenu").click(() => {
    goToEditList()
  })


  $("#addRecipe").click(async () => {
    var formData = new FormData();

    formData.append("image", null)
    formData.append("video", null)
    formData.append("title", "Default")
    formData.append("content", "...")
    formData.append("createBy", loggedUser._id)


    // do {
    //   let valueObj = formEntries.next();
    //   var keyObj = formKeys.next();
    // } while (!keyObj.done)

    try {

      let data = await $.ajax({
        url: apiUrl + "recipe/add",
        type: "POST",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
      });
      updateEditList();
      console.log(data)
    } catch (e) {
      alert(e.responseText)
    }

  })

  $("#chooseImage").change((e) => {
    var input = e.target;
    var reader = new FileReader();
    reader.onload = function () {
      var dataURL = reader.result;
      $("#editImage").attr("src", dataURL)
    };
    reader.readAsDataURL(input.files[0]);
  })

  $("#chooseVideo").change((e) => {
    var input = e.target;
    var fileURL = URL.createObjectURL(input.files[0])
    $("#editVideo").attr("src", fileURL)
  })
  $("#editForm").submit(async function (e) {
    e.preventDefault()
    var formData = new FormData(this);
    // var formKeys = formData.keys();
    // var formEntries = formData.entries();
    formData.append("_id", editRecipe._id)

    try {
      let data = await $.ajax({
        url: apiUrl + "recipe/edit/" + editRecipe._id,
        type: "PUT",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
      });
      alert("The recipe was edited successfuly.")
    } catch (e) {
      console.log(e)
      alert(e.responseText)
    }
  })
}

async function deleteRecipe(id) {
  try {
    let data = await $.ajax({
      url: apiUrl + "recipe/" + id,
      type: "DELETE",
    });
  } catch (e) {
    console.log(e)
    alert(e.responseText)
  }

  updateEditList()

}


function setUpProfile() {
  $(".profile").click(() => {
    goToProfile()
  })

  $("#signOut").click(() => {
    persistentUser(null)
    goToLogin()
  })
  $("#changeAvatar").change((e) => {
    var input = e.target;
    var reader = new FileReader();
    reader.onload = function () {
      var dataURL = reader.result;
      $(".avatar img").attr("src", dataURL)
    };
    reader.readAsDataURL(input.files[0]);
  })
  $("#avatarForm").submit(async function (e) {
    e.preventDefault()
    var formData = new FormData(this);
    // formData.append("_id", loggedUser._id)
    try {
      let data = await $.ajax({
        url: apiUrl + "user/avatar/" + loggedUser._id,
        type: "PUT",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
      });
      loggedUser.avatar = data.avatar
      persistentUser(loggedUser)
      alert("The avatar was changed successfuly.")
    } catch (e) {
      console.log(e)
      alert(e.responseText)
    }

  })


}


function setUpCreatedPages() {
  $(document).on("pagecreate", "#home", function () {
    console.log("home created")
  });
  $(document).on("pagecreate", "#editList", function () {
    updateEditList()
  });
  $(document).on("pagecreate", "#profile", function () {
    updateProfile()
  });
}


$(document).ready(() => {
  isLoggedIn()
})


setUpCreatedPages()
setUpRegister()
setUpLogin()
setUpEditList()
setUpHome()
setUpProfile()