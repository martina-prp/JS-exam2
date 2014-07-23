'use strict';

$(document).ready(function() {

  loadAllData();

  $(document).on('keyup', '.variable-name', function() {
    $(this).parent().find('.update').removeAttr('disabled');
  });

  $(document).on('click', '.update', function(event) {
    event.preventDefault();

    var nameId = $(this).data('id');
    var name = $(this).parent().find('.variable-name').val();

    $.ajax({
      url: 'http://localhost:8080/name',
      type: 'POST',
      contentType: 'application/json',
      datatype: 'json',
      data: JSON.stringify({
        name: name,
        nameId: nameId
      })
    }).done(function(data) {
      if (data.status === 'NAME_NOT_FOUND') {
        $('.error-message').text(data.status);
      }
      else {
        location.reload();
      }
    });
  });

  function loadAllData() {
    $.ajax({
      url: 'http://localhost:8080/names',
      type: 'GET',
      contentType: 'application/json',
      datatype: 'json',
    }).done(function(data){
      var variableNamesTpl = $('#variable-names-tpl').html();
      var template = Handlebars.compile(variableNamesTpl);
      var html = template({variables: data});
      $('.main').append(html);
    });
  }
});
