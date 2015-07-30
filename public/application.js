$(document).ready(function(){

  $( "#create" ).click(function() {
    console.log( "create user" );
  });

  $('form[name="username"]').(function(){
    var name = $('form[name="username"]').val();
  });

  $.ajax({
    type: "POST",
    url: 'users',
    data: {
      user:{
        username:'asasa'.
        name:'sasa',
        email:'dash@asd.com',
        password:'12123',
      }
    },
    dataType:'Json',


    success: function(response){
      $('.username').text(response.Title + ' (' + response.Released + ')');
    }
  });
  




});