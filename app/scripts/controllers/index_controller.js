EmberAndFriends.IndexController = Ember.ObjectController.extend({

  /**
   * Steam API-key provided by user input
   * @type {string}
   */
  apiKey: '',

  /**
   * Steam ID of user whose friends-list is parsed
   * @type {string}
   */
  steamid: '',

  /**
   * Percentage of parsed friends
   * Used in progress-bar
   * @type {number}
   */
  progress: 0,

  /**
   * Steam API-url for user's friends-list
   * @type {string}
   */
  apiUrlForFriendsList: 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=%@1&steamid=%@2&relationship=friend&format=json',

  /**
   * Steam API-url for user's personal info
   * @type {string}
   */
  apiUrlForUserInfo: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%@1&steamids=%@2',

  /**
   * Friends-list of <code>steamid</code> profile
   * @type {string[]}
   */
  listOfFriendsL1: [],

  /**
   * Should Submit button be disabled
   * @type {bool}
   */
  disableSubmit: false,

  /**
   * List of ajax-request for each friend's friends-list
   * @type {object[]}
   */
  queue: EmberAndFriends.AjaxQueue.create({}),

  /**
   * Map of parsed friends-list for each user from <code>listOfFriendsL1</code>
   * Format:
   * <code>
   *   {
   *    steamid1: [steamid2, steamid3],
   *    steamid2: [steamid1, steamid4],
   *    steamid3: [steamid3]
   *   }
   * </code>
   * @type {object}
   */
  friendsMap: {},

  /**
   * List of all unique steamids from <code>friendsMap</code>
   * @type {string[]}
   */
  allSteamIds: [],

  /**
   * List users whose friends-lists weren't loaded
   * @type {string[]}
   */
  failedIds: [],

  /**
   * List of user-groups
   * @type {string[][]}
   */
  calculatedGroups: [],

  /**
   * Is <code>friendsMap</code> filled
   * @type {bool}
   */
  loadingComplete: true,

  /**
   * True if friends are loaded, groups are calculated and users data are loaded
   * @type {bool}
   */
  preparingComplete: false,

  /**
   * List of users steam info (name, avatar, profileurl etc)
   * @type {Object[]}
   */
  usersInfo: [],

  /**
   * Calculated groups with injected user info
   * @type {object[]}
   */
  formattedGroups: [],

  /**
   * List of not loaded chunk of users (if <code>loadUsersInfo</code>-request was failed)
   * @type {string[]}
   */
  failedChunks: [],

  /**
   * List of messages for user
   * @type {string[]}
   */
  workLog: [],

  /**
   * Clean controller's data before each submit request
   * @method cleanUp
   */
  cleanUp: function() {
    this.get('listOfFriendsL1').clear();
    this.get('failedIds').clear();
    this.get('queue').clear();
    this.get('allSteamIds').clear();
    this.get('usersInfo').clear();
    this.get('workLog').clear();
    this.get('formattedGroups').clear();
    this.set('progress', 0);
    this.set('loadingComplete', true);
    this.set('preparingComplete', false);
    this.set('friendsMap', {});
  },

  /**
   * Save list of <code>steamid</code> friends to <code>listOfFriendsL1</code>
   * @param {object} data
   * @method saveL1Friends
   */
  saveL1Friends: function(data) {
    var friends = Em.get(data, 'friendslist.friends');
    if (Em.isNone(friends)) friends = [];
    this.set('listOfFriendsL1', friends.mapBy('steamid'));
    this.get('workLog').pushObject('Friends list lvl1 is loaded.');
  },

  /**
   * After <code>listOfFriendsL1</code> is loaded
   * @method loadL1FriendsComplete
   */
  loadL1FriendsComplete: function() {
    if (!this.get('listOfFriendsL1').length) return;
    this.loadFriendsForEachFriendL1();
    this.get('queue').set('finishedCallback', 'queueComplete');
  },

  init: function() {
    this._super();
    this.get('queue').setProperties({
      finishedCallbackSender: this,
      finishedCallback: 'queueComplete'
    });
  },

  /**
   * Create "friends-list" request for each user from <code>steamids</code>
   * @param {string[]} steamids
   * @method fillQueue
   */
  fillQueue: function(steamids) {
    var q = this.get('queue'),
      self = this;
    q.clear();
    steamids.forEach(function(friend, index) {
      q.addRequest({
        name: 'load_friends',
        sender: self,
        error: 'errorHandler',
        success: 'successProgress',
        data: {
          url: self.get('apiUrlForFriendsList').fmt(self.get('apiKey'), friend),
          index: index,
          steamid: friend
        }
      });
    });
  },

  /**
   * Create and start queue of "friends-list" requests for each user from <code>listOfFriendsL1</code>
   * @method loadFriendsForEachFriendL1
   */
  loadFriendsForEachFriendL1: function() {
    this.fillQueue(this.get('listOfFriendsL1'));
    this.set('loadingComplete', false);
    this.get('queue').start();
    this.get('workLog').pushObject('Starting to load friends list for each friend lvl1.');
  },

  /**
   * Update <code>progress</code> value after each ajax-request
   * @method updateProgress
   */
  updateProgress: function() {
    this.incrementProperty('progress', 1 / this.get('listOfFriendsL1.length') * 100);
    this.propertyDidChange('progress');
  },

  /**
   * Success callback for each request in <code>queue</code>
   * @param {object} data
   * @param {object} opt
   * @param {object} params
   * @method successProgress
   */
  successProgress: function(data, opt, params) {
    this.updateProgress();
    var friends = Em.get(data, 'friendslist.friends'),
      friendsMap = this.get('friendsMap');
    if (Em.isNone(friends)) friends = [];
    var steamids = friends.mapBy('steamid');
    steamids.push(params.steamid); // add user to his own friend-list
    friendsMap[params.steamid] = steamids;
    this.get('allSteamIds').pushObjects(steamids);
    this.get('workLog').pushObject('Friends list for ' + params.steamid + ' is loaded. Overall - ' + (steamids.length -1)+ ' friends.');
  },

  /**
   * Error callback for each request in <code>queue</code>
   * @param request
   * @param ajaxOptions
   * @param error
   * @param opt
   * @param params
   * @method errorHandler
   */
  errorHandler: function(request, ajaxOptions, error, opt, params) {
    //this.updateProgress();
    this.get('failedIds').pushObject(params.steamid);
    this.get('workLog').pushObject('Request for ' + params.steamid + ' is failed. Retry after current queue will be completed');
  },

  /**
   * Complete callback for <code>queue</code>
   * Check if some user's friends-list weren't loaded and create/start new queue from <code>failedIds</code>
   * Otherwise calculate groups of users where everyone "knows" everyone
   * @method queueComplete
   */
  queueComplete: function() {
    this.set('loadingComplete', true);
    var friendsMap = this.get('friendsMap'),
      failedIds = this.get('failedIds');
    friendsMap[this.get('steamid')] = this.get('listOfFriendsL1');
    if (failedIds.length) {
      this.fillQueue(failedIds);
      failedIds.clear();
      this.set('loadingComplete', false);
      this.get('queue').start();
      this.get('workLog').pushObject('Starting load failed users.');
    }
    else {
      this.get('workLog').pushObject('All friend-lists are loaded.');
      this.calculateGroups();
      var users = [], groups = this.get('calculatedGroups');
      groups.forEach(function(group) {
        users = users.concat(group);
      });
      users = users.concat(this.get('listOfFriendsL1'));
      users = users.uniq();
      var chunkSize = 50,
        chunks = [];
      for (var i=0,j=users.length; i<j; i+=chunkSize) {
        chunks.pushObject(users.slice(i,i+chunkSize));
      }
      this.loadUsersInfo(chunks);
    }
  },

  /**
   * Create queue with usersinfo requests and start it
   * @param {string[]} chunks list of steamids to be loaded
   * @method loadUsersInfo
   */
  loadUsersInfo: function(chunks) {
    var queue = this.get('queue'),
      self = this;
    queue = EmberAndFriends.AjaxQueue.create();
    queue.setProperties({
      finishedCallbackSender: this,
      finishedCallback: 'loadUsersInfoComplete'
    });
    chunks.forEach(function(chunk) {
      queue.addRequest({
        name: 'load_friends',
        sender: self,
        success: 'successLoadUsersInfo',
        error: 'errorLoadUsersInfo',
        data: {
          url: self.get('apiUrlForUserInfo').fmt(self.get('apiKey'), chunk.join(',')),
          steamids: chunk
        }
      });
    });
    this.get('failedChunks').clear();
    this.get('workLog').pushObject('Start load users info (50 users per request).');
    this.get('workLog').pushObject('Overall chunks  - ' + chunks.length + '.');
    queue.start();
  },

  /**
   * Success-callback for users-info request
   * @param {object} data
   * @method successLoadUsersInfo
   */
  successLoadUsersInfo: function(data) {
    var usersInfo = this.get('usersInfo');
    usersInfo = usersInfo.concat(data.response.players);
    this.set('usersInfo', usersInfo);
    this.get('workLog').pushObject('Chunk is loaded.');
  },

  /**
   * Error-callback for users-info request
   * @param {object} request
   * @param {object} ajaxOptions
   * @param {string} error
   * @param {object} opt
   * @param {object} params
   * @method errorLoadUsersInfo
   */
  errorLoadUsersInfo: function(request, ajaxOptions, error, opt, params) {
    this.get('workLog').pushObject('Request is failed. Chunk is added to queue with failed requests.');
    this.get('failedChunks').push(params.steamids);
  },

  /**
   * Callback for usersinfo queue complete
   * @method loadUsersInfoComplete
   */
  loadUsersInfoComplete: function() {
    this.get('workLog').pushObject('Formatting groups.');
    var groups = this.get('calculatedGroups'),
      formattedGroups = this.get('formattedGroups'),
      usersInfo = this.get('usersInfo'),
      failedChunks = this.get('failedChunks');
    if (failedChunks.length) {
      this.loadUsersInfo(failedChunks);
      return;
    }
    formattedGroups.clear();
    groups.forEach(function(group) {
      var f = [];
      group.forEach(function(steamid) {
        f.pushObject(usersInfo.findBy('steamid', steamid));
      });
      formattedGroups.pushObject(f);
    });
    this.propertyDidChange('formattedGroups');
    this.set('preparingComplete', true);
    this.set('disableSubmit', false);
    this.get('workLog').pushObject('Done.');
  },

  /**
   * Calculates groups of users where everyone "knows" everyone
   * Filter out duplicated groups
   * @method calculateGroups
   */
  calculateGroups: function() {
    this.get('workLog').pushObject('Calculating groups.');
    var friendsMap = this.get('friendsMap'),
      listOfFriendsL1 = Em.copy(this.get('listOfFriendsL1')).concat(this.get('steamid')),
      allSteamIds = this.get('allSteamIds').uniq(),
      ids = Em.keys(friendsMap),
      calculatedGroups = [];
    ids.forEach(function(k) {
      friendsMap[k].forEach(function(id) {
        if (friendsMap[id]) {
          if (!friendsMap[id].contains(k)) {
            friendsMap[id].push(k);
          }
        }
      });
    });
    friendsMap[this.get('steamid')].push(this.get('steamid'));
    ids.forEach(function(id) {
      var intersection = Em.EnumerableUtils.intersection(listOfFriendsL1, friendsMap[id]);
      if (intersection.length > 0) {
        var intersectionCopy = Em.copy(intersection);
        for (var i = 0; i < intersection.length; i++) {
          var innerIntersection = Em.EnumerableUtils.intersection(intersectionCopy, friendsMap[intersection[i]]);
          if (intersectionCopy.length != innerIntersection.length) {
              intersectionCopy = intersectionCopy.without(intersection[i]);
          }
          if (intersectionCopy.length <= 2) break;
        }
        if (intersectionCopy.length > 2) {
          calculatedGroups.push(intersectionCopy.sort());
        }
      }
    });

    calculatedGroups.forEach(function(group, index) {
      calculatedGroups[index] = JSON.stringify(group);
    });

    calculatedGroups = calculatedGroups.uniq();

    calculatedGroups.forEach(function(group, index) {
      calculatedGroups[index] = JSON.parse(group);
    });
    calculatedGroups = this.removeSubGroups(calculatedGroups);
    this.set('calculatedGroups', calculatedGroups);
    console.log(calculatedGroups);
    console.log(allSteamIds);
  },

  /**
   * Remove sub-groups
   * Example: groupA - [1,2,3,4], groupB - [1,2,3]. groupB should be removed, because all its items are in groupA
   * @param {Array} collection
   * @returns {Array} Filtered collection
   */
  removeSubGroups: function(collection) {
    var copy = [],
      self = this;
    collection.forEach(function(c, index) {
      for (var i = 0; i < collection.length; i++) {
        if (i !== index) {
          if (self.isSubArray(c, collection[i])) {
            return;
          }
        }
      }
      copy.push(c);
    });
    return copy;
  },

  isSubArray: function (subArray, array) {
    for(var i = 0 , len = subArray.length; i < len; i++) {
      if(!array.contains(subArray[i])) return false;
    }
    return true;
  },

  actions: {

    /**
     * Submit-handler
     * @returns {$.ajax}
     * @method submit
     */
    submit: function() {
      this.set('disableSubmit', true);
      this.cleanUp();
      return EmberAndFriends.ajax.send({
        name: 'load_friends',
        sender: this,
        data: {
          url: this.get('apiUrlForFriendsList').fmt(this.get('apiKey'), this.get('steamid'))
        },
        success: 'saveL1Friends',
        complete: 'loadL1FriendsComplete'
      });
    }
  }

});