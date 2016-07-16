function ssUpdateSubCount() {
  var endpoint = channel.apiUrl + '/channels';

  $.get (endpoint,
    {
      id: channel.channelId,
      key: channel.apiKey,
      part: 'statistics'
    },
    function (r) {
      channel.subCount = r.items[0].statistics.subscriberCount;
      $('#sub-count').html (channel.subCount);
    }
  );
}

function ssUpdateStats() {
  ssUpdateSubCount();
  setTimeout (ssUpdateStats, channel.refreshMillis);
}

function ssUpdateSubGoal() {
  $('#sub-goal').html (channel.subGoal);
}

$(document).ready (function() {
  ssUpdateSubGoal();
  ssUpdateStats();
});

// https://www.googleapis.com/youtube/v3/channels?part=statistics&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY
