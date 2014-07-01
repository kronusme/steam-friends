EmberAndFriends.IndexView = Ember.View.extend({

  errors: {
    apikey: false,
    steamid: false
  },

  submitDisabled: function() {
    if (this.get('controller.disableSubmit')) {
      return true;
    }
    var errors = this.get('errors');
    return errors.apikey || errors.steamid;
  }.property('errors.apikey', 'errors.steamid', 'controller.disableSubmit'),

  apiKeyView: Em.TextField.extend({
    validate: function() {
      var v = !(/^\w{32}$/.test(this.get('value')));
      this.set('isValid', v);
      this.set('parentView.errors.apikey', v);
    }.observes('value')
  }),

  steamIdView: Em.TextField.extend({
    validate: function() {
      var v = !(/^\d{15,}$/.test(this.get('value')));
      this.set('isValid', v);
      this.set('parentView.errors.steamid', v);
    }.observes('value')
  }),

  /**
   * Graph with friends relationships
   * @type {sigma}
   */
  graph: null,

  /**
   * Create graph with friends relationships
   * @method createGraph
   */
  createGraph: function() {
    if (!this.get('controller.preparingComplete')) return;
    this.$('#graph').css({height: 800});
    sigma.utils.pkg('sigma.canvas.nodes');
    sigma.canvas.nodes.image = (function() {
      var _cache = {},
        _loading = {},
        _callbacks = {};

      // Return the renderer itself:
      var renderer = function(node, context, settings) {
        var args = arguments,
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          color = node.color || settings('defaultNodeColor'),
          url = node.url;

        if (_cache[url]) {
          context.save();

          // Draw the clipping disc:
          context.beginPath();
          context.arc(
            node[prefix + 'x'],
            node[prefix + 'y'],
            node[prefix + 'size'],
            0,
            Math.PI * 2,
            true
          );
          context.closePath();
          context.clip();

          // Draw the image
          context.drawImage(
            _cache[url],
            node[prefix + 'x'] - size,
            node[prefix + 'y'] - size,
            2 * size,
            2 * size
          );

          // Quit the "clipping mode":
          context.restore();

          // Draw the border:
          context.beginPath();
          context.arc(
            node[prefix + 'x'],
            node[prefix + 'y'],
            node[prefix + 'size'],
            0,
            Math.PI * 2,
            true
          );
          context.lineWidth = size / 5;
          context.strokeStyle = node.color || settings('defaultNodeColor');
          context.stroke();
        } else {
          sigma.canvas.nodes.image.cache(url);
          sigma.canvas.nodes.def.apply(
            sigma.canvas.nodes,
            args
          );
        }
      };
      renderer.cache = function(url, callback) {
        if (callback)
          _callbacks[url] = callback;

        if (_loading[url])
          return;

        var img = new Image();

        img.onload = function() {
          _loading[url] = false;
          _cache[url] = img;

          if (_callbacks[url]) {
            _callbacks[url].call(this, img);
            delete _callbacks[url];
          }
        };

        _loading[url] = true;
        img.src = url;
      };

      return renderer;
    })();

    var listOfFriendsL1 = this.get('controller.listOfFriendsL1'),
      usersInfo = this.get('controller.usersInfo'),
      steamid = this.get('controller.steamid'),
      friendsMap = this.get('controller.friendsMap'),
      graph = this.get('controller.graph'),
      g = {nodes: [], edges: []};
    listOfFriendsL1.forEach(function(friend) {
      g.nodes.push({
        id: '' + friend,
        label: usersInfo.findBy('steamid', friend).personaname,
        x: Math.random(),
        y: Math.random(),
        size: 1,
        type: 'image',
        url: usersInfo.findBy('steamid', friend).avatar,
        color: '#666'
      });
      g.edges.push({
        id: 'e' + friend,
        source: '' + steamid,
        target: '' + friend,
        size: 1,
        color: '#ccc'
      });
    });

    listOfFriendsL1.forEach(function(fid) {
      friendsMap[fid].forEach(function(id) {
        if (listOfFriendsL1.contains(id)) {
          g.edges.push({
            id: 'e' + fid + ' ' + id,
            source: '' + fid,
            target: '' + id,
            size: 1,
            color: '#ccc'
          });
        }
      });
    });

    if (!Em.isNone(graph)) graph.kill();

    sigma.renderers.def = sigma.renderers.canvas;
    graph = new sigma({
      graph: g,
      renderer: {
        container: document.getElementById('graph'),
        type: 'canvas'
      }
    });
    sigma.plugins.dragNodes(graph, graph.renderers[0]);
    this.set('graph', graph);
  }.observes('controller.preparingComplete')

});
