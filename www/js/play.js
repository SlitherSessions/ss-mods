var channel = {
  channelId: 'UCsIpq4M5xE3NC09m-rtJcqg',
  apiKey: 'AIzaSyBbSep6hU3F13KGqh9y81bUiOU9Mb01NAU',
  apiUrl: 'https://www.googleapis.com/youtube/v3',

  subCount: 0,
  subGoal: 175,
  refreshMillis: 5 * 1000
};

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
