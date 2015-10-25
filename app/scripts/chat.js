var channels     = ['tpsnake'], // Channels to initially join
    fadeDelay    = 5000, // Set to false to disable chat fade
    showChannel  = true, // Show repespective channels if the channels is longer than 1
    useColor     = true, // Use chatters' colors or to inherit
    showBadges   = true, // Show chatters' badges
    showEmotes   = true, // Show emotes in the chat
    doTimeouts   = true, // Hide the messages of people who are timed-out
    doChatClears = true, // Hide the chat from an entire channel
    showHosting  = true, // Show when the channel is hosting or not
    showConnectionNotices = true; // Show messages like "Connected" and "Disconnected"


var chat = document.getElementById('chat'),
    defaultColors = ['rgb(255, 0, 0)','rgb(0, 0, 255)','rgb(0, 128, 0)','rgb(178, 34, 34)','rgb(255, 127, 80)','rgb(154, 205, 50)','rgb(255, 69, 0)','rgb(46, 139, 87)','rgb(218, 165, 32)','rgb(210, 105, 30)','rgb(95, 158, 160)','rgb(30, 144, 255)','rgb(255, 105, 180)','rgb(138, 43, 226)','rgb(0, 255, 127)'],
    randomColorsChosen = {},
    clientOptions = {
      options: {
          debug: true
        },
      channels: channels
    },
    client = new irc.client(clientOptions);

function dehash(channel) {
  return channel.replace(/^#/, '');
}

function capitalize(n) {
  return n[0].toUpperCase() +  n.substr(1);
}

function htmlEntities(html) {
  function it() {
    return html.map(function(n, i, arr) {
      if(n.length == 1) {
        return n.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
          return '&#'+i.charCodeAt(0)+';';
        });
      }
      return n;
    });
  }
  var isArray = Array.isArray(html);
  if(!isArray) {
    html = html.split('');
  }
  html = it(html);
  if(!isArray) html = html.join('');
  return html;
}

function formatEmotes(text, emotes) {
  var splitText = text.split('');
  for(var i in emotes) {
    var e = emotes[i];
    for(var j in e) {
      var mote = e[j];
      if(typeof mote == 'string') {
        mote = mote.split('-');
        mote = [parseInt(mote[0]), parseInt(mote[1])];
        var length =  mote[1] - mote[0],
        empty = Array.apply(null, new Array(length + 1)).map(function() { return ''; });
        splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
        splitText.splice(mote[0], 1, '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">');
      }
    }
  }
  return htmlEntities(splitText).join('');
}

function badges(chan, user, isBot) {
  
  function createBadge(name) {
    var badge = document.createElement('div');
    badge.className = 'chat-badge-' + name;
    return badge;
  }
  
  var chatBadges = document.createElement('span');
  chatBadges.className = 'chat-badges';
  
  if(!isBot) {
    if(user.username == chan) {
      chatBadges.appendChild(createBadge('broadcaster'));
    }
    if(user['user-type']) {
      chatBadges.appendChild(createBadge(user['user-type']));
    }
    if(user.turbo) {
      chatBadges.appendChild(createBadge('turbo'));
    }
  }
  else {
    chatChages.appendChild(createBadge('bot'));
  }
  
  return chatBadges;
}

function handleChat(channel, user, message, self) {
  
  var chan        = dehash(channel),
      name        = user.username,
      chatLine    = document.createElement('div'),
      chatChannel = document.createElement('span'),
      chatName    = document.createElement('span'),
      chatColon   = document.createElement('span'),
      chatMessage = document.createElement('span');
  
  var color = useColor ? user.color : 'inherit';
  if(color === null) {
    if(!randomColorsChosen.hasOwnProperty(chan)) {
      randomColorsChosen[chan] = {};
    }
    if(randomColorsChosen[chan].hasOwnProperty(name)) {
      color = randomColorsChosen[chan][name];
    }
    else {
      color = defaultColors[Math.floor(Math.random()*defaultColors.length)];
      randomColorsChosen[chan][name] = color;
    }
  }
  
  chatLine.className = 'chat-line';
  chatLine.dataset.username = name;
  chatLine.dataset.channel = channel;
  
  if(user['message-type'] == 'action') {
    chatLine.className += ' chat-action';
  }
  
  chatChannel.className = 'chat-channel';
  chatChannel.innerHTML = chan;
  
  chatName.className   = 'chat-name';
  chatName.style.color = color;
  chatName.innerHTML   = user['display-name'] || name;
  
  chatColon.className = 'chat-colon';
  
  chatMessage.className = 'chat-message';
  
  chatMessage.style.color = color;
  chatMessage.innerHTML = showEmotes ? formatEmotes(message, user.emotes) : htmlEntities(message);
  
  if(client.opts.channels.length > 1 && showChannel) chatLine.appendChild(chatChannel);
  if(showBadges) chatLine.appendChild(badges(chan, user, self));
  chatLine.appendChild(chatName);
  chatLine.appendChild(chatColon);
  chatLine.appendChild(chatMessage);
  
  chat.appendChild(chatLine);
  
  if(typeof fadeDelay == 'number') {
    setTimeout(function() {
        chatLine.dataset.faded = '';
      }, fadeDelay);
  }
  
  if(chat.children.length > 50) {
    var oldMessages = [].slice.call(chat.children).slice(0, 10);
    for(var i in oldMessages) oldMessages[i].remove();
  }
  
}

function chatNotice(information, noticeFadeDelay, level, additionalClasses) {
  var ele = document.createElement('div');
  
  ele.className = 'chat-line chat-notice';
  ele.innerHTML = information;
  
  if(additionalClasses !== undefined) {
    if(Array.isArray(additionalClasses)) {
      additionalClasses = additionalClasses.join(' ');
    }
    ele.className += ' ' + additionalClasses;
  }
  
  if(typeof level == 'number' && level !== 0) {
    ele.dataset.level = level;
  }
  
  chat.appendChild(ele);
  
  if(typeof noticeFadeDelay == 'number') {
    setTimeout(function() {
        ele.dataset.faded = '';
      }, noticeFadeDelay || 500);
  }
  
  return ele;
}

var recentTimeouts = {};

function timeout(channel, username) {
  if(!doTimeouts) return false;
  if(!recentTimeouts.hasOwnProperty(channel)) {
    recentTimeouts[channel] = {};
  }
  if(!recentTimeouts[channel].hasOwnProperty(username) || recentTimeouts[channel][username] + 1000*10 < + new Date()) {
    recentTimeouts[channel][username] = + new Date();
    chatNotice(capitalize(username) + ' was timed-out in ' + capitalize(dehash(channel)), 1000, 1, 'chat-delete-timeout');
  }
  var toHide = document.querySelectorAll('.chat-line[data-channel="' + channel + '"][data-username="' + username + '"]:not(.chat-timedout) .chat-message');
  for(var i in toHide) {
    var h = toHide[i];
    if(typeof h == 'object') {
      h.innerText = '<Message deleted>';
      h.parentElement.className += ' chat-timedout';
    }
  }
}

function clearChat(channel) {
  if(!doChatClears) return false;
  var toHide = document.querySelectorAll('.chat-line[data-channel="' + channel + '"]');
  for(var i in toHide) {
    var h = toHide[i];
    if(typeof h == 'object') {
      h.className += ' chat-cleared';
    }
  }
  chatNotice('Chat was cleared in ' + capitalize(dehash(channel)), 1000, 1, 'chat-delete-clear');
}

function hosting(channel, target, viewers, unhost) {
  if(!showHosting) return false;
  if(viewers == '-') viewers = 0;
  var chan = dehash(channel);
  chan = capitalize(chan);
  if(!unhost) {
    var targ = capitalize(target);
    chatNotice(chan + ' is now hosting ' + targ + ' for ' + viewers + ' viewer' + (viewers !== 1 ? 's' : '') + '.', null, null, 'chat-hosting-yes');
  }
  else {
    chatNotice(chan + ' is no longer hosting.', null, null, 'chat-hosting-no');
  }
}

client.addListener('message', handleChat);
client.addListener('timeout', timeout);
client.addListener('clearchat', clearChat);
client.addListener('hosting', hosting);
client.addListener('unhost', function(channel, viewers) { hosting(channel, null, viewers, true); });

var joinAccounced = [];

client.addListener('connecting', function (address, port) {
  if(showConnectionNotices) chatNotice('Connecting', 1000, -4, 'chat-connection-good-connecting');
});

client.addListener('logon', function () {
  if(showConnectionNotices) chatNotice('Authenticating', 1000, -3, 'chat-connection-good-logon');
});

client.addListener('connectfail', function () {
  if(showConnectionNotices) chatNotice('Connection failed', 1000, 3, 'chat-connection-bad-fail');
});

client.addListener('connected', function (address, port) {
  if(showConnectionNotices) chatNotice('Connected', 1000, -2, 'chat-connection-good-connected');
  joinAccounced = [];
});

client.addListener('disconnected', function (reason) {
  if(showConnectionNotices) chatNotice('Disconnected: ' + (reason || ''), 3000, 2, 'chat-connection-bad-disconnected');
});

client.addListener('reconnect', function () {
  if(showConnectionNotices) chatNotice('Reconnected', 1000, 'chat-connection-good-reconnect');
});

client.addListener('join', function (channel, username) {
  if(joinAccounced.indexOf(channel) == -1) {
    if(showConnectionNotices) chatNotice('Joined ' + capitalize(dehash(channel)), 1000, -1, 'chat-room-join');
    joinAccounced.push(channel);
  }
});

client.addListener('part', function (channel, username) {
  var index = joinAccounced.indexOf(channel);
  if(index > -1) {
    if(showConnectionNotices) chatNotice('Parted ' + capitalize(dehash(channel)), 1000, -1, 'chat-room-part');
    joinAccounced.splice(joinAccounced.indexOf(channel), 1);
  }
});

client.addListener('crash', function () {
  chatNotice('Crashed', 10000, 4, 'chat-crash');
});

client.connect();
