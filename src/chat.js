function deleteMessages() {
  if (messagesHeight() > $("#chatMessages").height()) { $(".chatMessage:first").remove(); deleteMessages(); }
}

chatWebSocket = new WebSocket("ws://51.254.206.49:1337");
chatWebSocket.onopen = function() {
  $(".chatMessage").remove();
  $("#chatMessages").append('<div class="chatMessage"><span style="color:green;">Welcome to the chat!</span></div>');
};
chatWebSocket.onmessage = function(msg) {
  $("#chatMessages").append(msg.data);
  deleteMessages();
};
chatWebSocket.onerror = function(err) {
  $("#chatMessages").append('<div class="chatMessage"><span style="color:orange;">Got an error.</span></div>');
  deleteMessages();
};
chatWebSocket.onclose = function() {
  $("#chatMessages").append('<div class="chatMessage"><span style="color:red;">Chat closed.</span></div>');
  deleteMessages();
};

$("#playh .btnt.nsi.sadg1").click(function() {
  setTimeout(function(ip){
    if ((!ws || ws.readyState != ws.OPEN) && window.bso.ip == ip) {
      alert("Server is full! Looking for a new server...");
      document.location.href = "http://slither.io/";
    }
  }, 10000, window.bso.ip);
});

$("#showchat").click(function() {
    if (jQuery(this).attr('class') == 'on') {
      jQuery(this).attr('class', 'off');
      jQuery(this).html('Hide chat');
      $("#chat").show();
      options['chat'] = true;
    } else {
      jQuery(this).attr('class', 'on');
      jQuery(this).html('Show chat');
      $("#chat").hide();
      options['chat'] = false;
    }
});

$("#options").append(
  '<label id="showchat" class="on" style="text-align: center; border-radius: 12px; color: white; cursor: pointer; padding: 0px 20px; width:100%">Show chat</label>'
);
