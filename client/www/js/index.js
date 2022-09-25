/**
 * server deployed on the heroku
 */
const apiUrl = "https://coit20269ass32022.herokuapp.com/";
/**
 * server deployed on the localhost
 */
//const apiUrl = "http://localhost:5000/";

/**
 * Used to save the information of logged user
 */
var loggedUser = null
/**
 * Current editing recipe
 */
var editRecipe = null

/**
 * Get src by name
 * @param {*} name 
 * @returns 
 */
function getFileSrc(name) {
  return apiUrl + "uploads/" + name
}



/**
 * Check if the user is logged in or not. If not, redirect to login page
 * @returns 
 */
function isLoggedIn() {
  if (!loggedUser) {
    try {
      userStr = localStorage.getItem("loggedUser")
      savedUser = JSON.parse(userStr)
    }
    catch (e) {
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


/**
 * Save the user to localStorage
 * @param {*} user 
 */
function persistentUser(user) {
  loggedUser = user
  localStorage.setItem("loggedUser", JSON.stringify(loggedUser))
}


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  setUpCreatedPages()
  setUpRegister()
  setUpLogin()
  setUpEditList()
  setUpHome()
  setUpProfile()
}

/**
 * update the viewRecipe page
 * @param {*} id 
 * @returns 
 */
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

  ///Get the information of the author
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
  $("#createdBy").attr("src", getFileSrc(author.avatar))

}

/**
 * Go to the viewRecipe page by id
 * @param {*} id 
 */
function goToViewRecipe(id) {
  $("body").pagecontainer("change", "#recipeView");
  updateViewRecipe(id)
}

/**
 * Update the editRecipe page
 * @param {*} id 
 * @returns 
 */
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

/**
 * Update the Profile page
 */
async function updateProfile() {
  $(".avatar img").attr("src", getFileSrc(loggedUser.avatar))
  $("#profileName").text(loggedUser.name)
  $("#profileEmail").text(loggedUser.email)
  $("#changeAvatar").val('')

}

/**
 * Go to the EditRecipe page by id
 * @param {*} id 
 */
function goToEditRecipe(id) {
  updateEditRecipe(id);
  $("body").pagecontainer("change", "#recipeEdit");
}

/**
 * Go to the Profile page
 */
function goToProfile() {
  updateProfile()
  $("body").pagecontainer("change", "#profile");
}


/**
 * Go to the Login Page
 * @param {*} id 
 */
function goToLogin(id) {
  $("body").pagecontainer("change", "#login");
}

/**
 * update the Home page
 * @returns 
 */
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
                        <img src="${imgSrc}" onclick="goToViewRecipe('${recipe._id}')" />
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

/**
 * Go to the Home page
 */
function goToHome() {
  $("body").pagecontainer("change", "#home");
  updateHome()
}

/**
 * Go to the EditList page
 */
function goToEditList() {
  $("body").pagecontainer("change", "#editList");
  updateEditList();
}

/**
 * Update the EditList page
 */
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
      innerHtml += `
                    <div class="card">
                        <img src="${imageSrc}" onclick="goToEditRecipe('${recipe._id}')" />
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
    alert(e.responseText)
  }

}



/**
 * Setup the Login Page
 */
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
    e.preventDefault();
    var isvalid = $("#registerForm").valid();
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
        return alert(e.responseText)
      }

    }
  });

}

/**
 * Setup the Register page
 */
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
    e.preventDefault();
    var isvalid = $("#registerForm").valid();
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
      } catch (e) {
        alert(e.responseText)
      }

    }
  });

}

/**
 * Setup the Home page
 */
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

/**
 * Delete a recipe by id
 * @param {*} id 
 */
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


/**
 * Setup the Profile page
 */
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
      return alert(e.responseText)
    }

  })


}

/**
 * Setup the all created pages
 */
function setUpCreatedPages() {
  $(document).on("pagecreate", "#home", function () {
    updateHome()
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

