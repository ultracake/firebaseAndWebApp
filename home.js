// Set the configuration for your app
// TODO: Replace with your project's config object
var firebaseConfig = {
    apiKey: "AIzaSyBCudu1R4IB-FroOsYNSzc8TI1_v7z620A",
    authDomain: "sharethings-337fe.firebaseapp.com",
    databaseURL: "https://sharethings-337fe.firebaseio.com",
    projectId: "sharethings-337fe",
    storageBucket: "sharethings-337fe.appspot.com",
    messagingSenderId: "818232127537",
    appId: "1:818232127537:web:ca9115db0d47b3df"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestoreDB = firebase.firestore();

// check if user is loggin or not
firebase.auth().onAuthStateChanged(function(user) 
{
    if (user)
     {
      // User is signed in.
      //window.alert("your are login test");
      document.getElementById("login_div").style.display = "none";
      document.getElementById("user_div").style.display = "initial";

      var user = firebase.auth().currentUser;

      if (user != null)
      {
        var email_id = user.email;
        document.getElementById("user_paragraph").innerHTML = "Hi " + email_id;
      }
    } else
    {
      // No user is signed in.
      document.getElementById("login_div").style.display = "block";
      document.getElementById("user_div").style.display = "none";
    }
  });

function login()
{
  var userEmail = document.getElementById("email_input").value;
  var userPassword = document.getElementById("password_input").value;
  //window.alert(userEmail + " " + userPassword);

  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then(function()
  {
    //loggedin successful
    //reset data
    document.getElementById("email_input").value = "";
    document.getElementById("password_input").value = "";

  }).catch(function(error)
  {
    //Handle error here.
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error occured: " + errorMessage);
  });  
}

function logout()
{
  firebase.auth().signOut().then(function()
  {
    //after signout

  }).catch(function(error)
  {
     //Handle error here.
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error occured: " + errorMessage);
  });
}

function writeUserToDB(dbName)
{
  var data = document.getElementById("data").value;
  var description = document.getElementById("description").value;

  var mylist = 
  {
    data: data,
    description: description 
  };

  writeDB(dbName, mylist);
  reset();
}

function writeDB(collectionName, mylist)
{
  firestoreDB.collection(collectionName).doc(mylist.data).set(mylist)
  .then(function(docRef) 
  {
    console.log("Document written with ID: ", docRef);
  })
  .catch(function(error) 
  {
    console.error("Error adding document: ", error);
  });
}

function readUserFromDB(collectionName)
{
  document.getElementById("showSection").innerHTML;
  read(collectionName);

}

function read(collectionName)
{
  firestoreDB.collection(collectionName).get().then((querySnapshot) =>
  {
    document.getElementById("cardSection").innerHTML = ""; 

    querySnapshot.forEach((doc) => 
    {
      console.log(`${doc.id} => ${doc.data()}`);
      var ValueFromDB = doc.data(); 

      //formatting for method use
      var valData = "'" + ValueFromDB.data + "'";
      var valDescription = "'" + ValueFromDB.description + "'";

      //used symbol ( ` ), its next to symbol ( ? )
      document.getElementById("cardSection").innerHTML += 
      `<div class="card mb-3">
        <div class="card body">
          <h5 class="card-text">${ValueFromDB.data}</h5>
          <p>${ValueFromDB.description}</p>

          <button type="submit" style="color:green" class="btn btn-warning"
          onclick="myUpdate(${ValueFromDB.id}, ${valData}, ${valDescription})"> 
            <i class="fas fa-edit"></i>
            Edit data
          </button>

          <button style="color:black" class="btn btn-danger"
          onclick="deleteFromDB('users', ${valData})"> 
            <i class="fas fa-trash-alt"></i> 
            Delete
          </button>

        </div>
      </div>
      `;
    });
  });
}

function deleteFromDB(collectionName, dataName)
{
  firestoreDB.collection(collectionName).doc(dataName).delete().then(function() 
  {
    console.log("Document successfully deleted!");
  }).catch(function(error)
  {
    console.error("Error removing document: ", error);
  });

  read(collectionName);
}

function reset()
{
  document.getElementById("section1").innerHTML =
  `
    <form class="border p-4 mb-4" id="form">
      <div class="form-group">
          <label>Insert data</label>
          <input type="text" class="form-control" id="data" placeholder="Enter data">
      </div>

      <div class="form-group">
          <label>Description </label>
          <input type="text" class="form-control" id="description" placeholder="Description">
      </div>
    </form>

    <button class="btn btn-success" onclick="writeUserToDB('users')">
      <i class="far fa-plus-square"></i>
      Add data
    </button>
    <button onclick="read('users')">read data</button>
  `;
}

function myUpdate(id, name, description)
{
  //changing section1 to edit mode, making form2!!!
  document.getElementById("section1").innerHTML =
  `
    <form class="border p-4 mb-4" id="form2">
      <div class="form-group">
          <label>Data name</label>
          <input type="text" class="form-control" id="data" placeholder="${name}">
      </div>

      <div class="form-group">
          <label>Description </label>
          <input type="text" class="form-control" id="description" placeholder="${description}">
      </div>
    </form>

    <button onclick="writeUserToDB('users')" class="btn btn-success">Update data</button>
    <button onclick="reset()" class="btn btn-danger">Cancel</button>
  `;
}

function saveStaticDataToFile()
{
   var filename = "rexTest";
   var file = new Blob(["welcome test"], {type: "text/plain;charset=utf-8"});
   
   if (window.navigator.msSaveOrOpenBlob) // IE10+
   {
      window.navigator.msSaveOrOpenBlob(file, filename);
   }
   else // Others
   {
      var a = document.createElement("a"), url = URL.createObjectURL(file);
     
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() 
      {
         document.body.removeChild(a);
         window.URL.revokeObjectURL(url);  
      }, 0); 
   }
}


