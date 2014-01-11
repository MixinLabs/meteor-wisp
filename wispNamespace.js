var resolvePathList = function (list, global) {
  var listLength = list.length,
      part, i;

  for (i = 0; i < listLength; i++) {
    part = list[i];
    global = global[part];
    if (!global) {
      throw new Meteor.Error(400, 'Could not resolve wisp namespace "' + list.join('.') + '"');
    }
  }

  return global;
};

__wisp__ = {
  namespace: function (id, exports) {
    var ns = id.split('.'),
        ref, nsPart, i;

    for (i = 0; i < ns.length; i++) {
      nsPart = ns[i];
      exports[nsPart] = exports[nsPart] || {};
      exports = exports[nsPart];
    }

    return exports;
  },

  require: function (id, exports, global) {
    var ns = id.split('.');
    var currentModule = ns[ns.length - 1];
    var currentPackage = ns.slice(0, ns.length - 1);

    return function (path) {
      var pathList = path.split('/'),
          fragment, target;

      if (path === '.') {
        return exports;
      }

      if (path.indexOf('.') === -1) {
        return resolvePathList(path.split('/'), global);
      }

      for (i = 0; i < pathList.length; i++) {
        fragment = pathList[i];

        if (fragment === '.') {
          target = currentPackage;
          continue;
        }

        if (fragment === '..') {
          target = target.slice(0, target.length - 1);
          continue;
        }

        target.push(fragment);
      }

      return resolvePathList(target, global);
    };
  }
};