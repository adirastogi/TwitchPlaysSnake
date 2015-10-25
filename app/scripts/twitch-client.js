/* global TwitchChat,TwitchPlaysSnake, irc */
'use strict';

var TwitchClient = new irc.client({
  channels: ['tpsnake'],
  options: {
    debug: true
  }
});

TwitchClient.addListener('clearchat',    TwitchChat.clearChat);
TwitchClient.addListener('connected',    TwitchChat.connected);
TwitchClient.addListener('connectfail',  TwitchChat.connectfail);
TwitchClient.addListener('connecting',   TwitchChat.connecting);
TwitchClient.addListener('crash',        TwitchChat.crash);
TwitchClient.addListener('disconnected', TwitchChat.disconnected);
TwitchClient.addListener('join',         TwitchChat.join);
TwitchClient.addListener('message',      TwitchPlaysSnake.handleChat);
TwitchClient.addListener('hosting',      TwitchChat.hosting);
TwitchClient.addListener('logon',        TwitchChat.logon);
TwitchClient.addListener('part',         TwitchChat.part);
TwitchClient.addListener('reconnect',    TwitchChat.reconnect);
TwitchClient.addListener('timeout',      TwitchChat.timeout);
TwitchClient.addListener('unhost',       TwitchChat.unhost);

TwitchClient.connect();
