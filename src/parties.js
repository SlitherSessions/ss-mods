function addParty() {
  return;
  $("#playh").after('<div id="party" style="margin: auto; width: 200px; display: block !important; margin-bottom: 25px"><div class="btn-group" style="width: 100%"><button class="btn btn-success" id="createParty" style="width: 50%">Create</button><button style="width: 50%" class="btn btn-primary" id="joinParty">Join</button></div><input id="partyCode" placeholder="Party Code" class="form-control" type="text" style="width: 100%;color:black;text-align:center;font-weight:bold;box-shadow:inset 0 0 3px #000;"></div>');
  $(".btnt.nsi.sadg1:first").css('margin-bottom', '35px');

  jQuery("#createParty").click (function (e) {
    if (! window.bso) {
      $("#partyCode").val ("click play");
      setTimeout(function() {
        $("#partyCode").val ('');
      }, 1000);
      return;
    }

    $.get("http://51.254.206.4:8080/create/" + window.bso.ip + ':' + window.bso.po, function(data) {
      $("#partyCode").val (data);
      forceServer (window.bso.ip, window.bso.po);
      document.location.href = "http://slither.io/#" + data;
    });
    return false;
  });

  jQuery("#joinParty").click (function (e) {
    if ($("#partyCode").val() == '') {
      window.forcing = false;
      getData("/i49526.txt", o);
    } else {
      $.get("http://51.254.206.4:8080/join/" + $("#partyCode").val(), function(data) {
        if (data == 'error') {
          $("#partyCode").val('wrong code');

          setTimeout (function() {
            $("#partyCode").val('');
          }, 1000);
        } else {
          srv = data.split(":");
          forceServer (srv[0], srv[1]);
        }
      });
    }
    return false;
  });

  $("#createParty").css('border-bottom-left-radius', '0');
  $("#joinParty").css('border-bottom-right-radius', '0');
  $("#partyCode").css('border-top-left-radius', '0');
  $("#partyCode").css('border-top-right-radius', '0');
}

if (document.location.href.indexOf("#") != -1) {
  $.get("http://51.254.206.4:8080/join/" + document.location.href.substr(document.location.href.indexOf("#")+1,6), function(data) {
    if (data == 'error') {
      $("#partyCode").val('wrong code');

      setTimeout(function() {
        $("#partyCode").val('');
      }, 1000);
    } else {
      $("#partyCode").val(document.location.href.substr(document.location.href.indexOf("#")+1,6));
      srv = data.split(":");
      forceServer (srv[0], srv[1]);
    }
  });
}
