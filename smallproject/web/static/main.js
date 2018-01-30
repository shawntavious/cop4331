
var enabled = 0;
var api_key_G = ""

function navflip() {
    if(enabled == 0 ){
        w3_open();
    }
    else if(enabled == 1){
        w3_close();
    }
}

function w3_open() {
    enabled = 1;
    document.getElementById("body").classList.remove('w3-animate-right');
    document.getElementById("body").classList.add('w3-animate-left');
    document.getElementById("content").style.marginLeft = "15%";
    document.getElementById("nav-sidebar").style.width = "15%";
    document.getElementById("nav-sidebar").style.display = "block";
}

function w3_close() {
    enabled = 0;
    document.getElementById("body").classList.remove('w3-animate-left');
    document.getElementById("body").classList.add('w3-animate-right');
    document.getElementById("content").style.marginLeft = "0%";
    document.getElementById("nav-sidebar").style.display = "none";
}

// Modifies the contents of the content div with whatever page.html you send into this function... send file name as a string pls!
function loadContent(pagename) {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         document.getElementById("content").innerHTML = this.responseText;
      }
   };
   xhttp.open("GET", pagename, true);
   xhttp.send();
}

function register() {
    var g_email = $("input[name='email']").val();
    var g_password = $("input[name='password']").val();
    var g_username = $("input[name='username']").val();

    $.ajax({
        url: "http://35.227.78.91/register",
        type: 'post',
        data: {
            name: g_username,
            email: g_email,
            password: g_password
        },
        success: function(result){
            alert('You are now registered! Please login.');
            loadContent("login.html");
        },
        error: function(result){
            loadContent("failRegister.html");
    }});
}
function logout() {
    document.cookie = "api_key=;";
    document.getElementById("username").innerHTML = "Anonymous";
    // Add a line to remove all of the previously loaded contacts... TODO
    api_key_G = "";
    renderContacts();
    loadContent("login.html");
}

function login() {

    var g_email = $("input[name='email']").val();
    var g_password = $("input[name='password']").val();

    $.ajax({
		url: "http://35.227.78.91/login",
		type: 'post',
		data: {
			email: g_email,
			password: g_password
		},
		success: function(result){
         document.cookie = 'api_key=' + result.api_key + ' path=/'
         api_key_G = result.api_key
         document.getElementById("username").innerHTML = g_email;
        	console.log(result);
        renderContacts();
        loadContent("welcomeUser.html");
        },
        error: function(result){
            loadContent("failLogin.html");
        }

    });
}

function renderContact(id) {

    $.ajax({
		url: "http://35.227.78.91/contact/get",
		type: 'post',
		data: {
			api_key: api_key_G,
         ContactID: id
		},
		success: function(result){
         response = `
         <div class="w3-container contentCenter" style="max-width: 800px;">
         	<form class='w3-padding w3-card-4 w3-light-grey'>
         		<label>Name:</label></br>
         		<b>${result.contact_name}</b></br></br>
         		<label>Address:</label></br>
         		<b>${result.contact_address}</b></br></br>
         		<label>City:</label></br>
         		<b>${result.contact_city}</b></br></br>
         		<label>State:</label></br>
         		<b>${result.contact_state}</b></br></br>
         		<label>Zip:</label></br>
         		<b>${result.contact_zip_code}</b></br></br>
         		<label>Home Phone:</label></br>
         		<b>${result.contact_home_phone}</b></br></br>
         		<label>Cell Phone:</label></br>
         		<b>${result.contact_cell_phone}</b></br></br>
         		<label>Work Phone:</label></br>
         		<b>${result.contact_work_phone}</b></br></br>
         		<label>Primary Email:</label></br>
         		<b>${result.contact_primary_email}</b></br></br>
         		<label>Secondary Email:</label></br>
         		<b>${result.contact_secondary_email}</b></br></br>
         	</form>
         </div>
         `
        	document.getElementById("content").innerHTML = response;
         console.log(result);
    }});
}

function addContact() {

    var name = $("input[name='name']").val();
    var address = $("input[name='address']").val();
    var city = $("input[name='city']").val();
    var state = $("input[name='state']").val();
    var zip = $("input[name='zip']").val();
    var home = $("input[name='home']").val();
    var cell = $("input[name='cell']").val();
    var work = $("input[name='work']").val();
    var email = $("input[name='email']").val();
    var email2 = $("input[name='email2']").val();

    $.ajax({
        url: "http://35.227.78.91/contact/add",
        type: 'post',
        data: {
            api_key : api_key_G,
            contact_name : name,
            contact_address : address,
            contact_city : city,
            contact_state : state,
            contact_zip_code : zip,
            contact_home_phone : home,
            contact_cell_phone : cell,
            contact_work_phone : work,
            contact_primary_email : email,
            contact_secondary_email : email2
        },
        success: function(result){
            console.log("add success");
            renderContacts();
            loadContent("welcomeUser.html");
        },
        error: function(result){
            console.log("add fail");
        }

    });
}

function renderAddContact() {

    loadContent("addContact.html");
}

function renderContacts() {

    var contactResponse = "<a href='#' class='w3-bar-item w3-button w3-border' onclick='renderAddContact()'><center><b>Add</b></center></a>";

    $.ajax({
		url: "http://35.227.78.91/user/contacts",
		type: 'post',
		data: {
			api_key: api_key_G
		},
		success: function(result){
         
            $.each(result, function(index){
                contactResponse += "<a href='#' class='w3-bar-item w3-button w3-border' onclick='renderContact(result[index].ContactID)'>" + result[index].contact_name + "</a>";
            });

        	document.getElementById("nav-sidebar").innerHTML = contactResponse;
            console.log(result);
        },
        error: function(result){
            document.getElementById("nav-sidebar").innerHTML = contactResponse;
        }
    });
}
