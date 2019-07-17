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
}

function writeDB(collectionName, mylist)
{
  firestoreDB.collection(collectionName).add(mylist)
  .then(function(docRef) 
  {
    console.log("Document written with ID: ", docRef.id);
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

      //used symbol ( ` ), its next to symbol ( ? )
      document.getElementById("cardSection").innerHTML += 
      `<div class="card mb-3">
        <div class="card body">
          <h5 class="card-text">${ValueFromDB.data}</h5>
          <p>${ValueFromDB.description}</p>

          <button type="submit" style="color:green" class="btn btn-warninig"
          onclick="update(${ValueFromDB.id})">Edit data</button>

          <button type="submit" style="color:black" class="btn btn-danger"
          onclick="delete(${ValueFromDB.id})">Delete</button>

        </div>
      </div>
      `;
      
      //if(){}
    });
  });
}


