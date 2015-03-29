var wispCompiler = Npm.require('wisp/compiler');

var handler = function (compileStep) {
  var source = compileStep.read().toString('utf-8');
  var outputFile = compileStep.inputPath + '.js';
  var isBrowser = (compileStep.arch === 'browser' ? true : false);
  var output;

  try {
    output = wispCompiler.compile(source, { sourceMaps: true });
  } catch (e) {
    throw new Error(
          "there is error" + compileStep.inputPath + ':' +
          (e.location ? (e.location.first_line + ': ') : ' ') +
          e.message
        );
  }

  var meteorWispNS = function (source, sourceMap) {
    if (sourceMap)
      var sourceMapJSON = JSON.parse(sourceMap);

    var injectStr  = '$&var global = exports;' +
                     'exports = __wisp__.namespace(_ns_.id, exports);' +
                     'var require = __wisp__.require(_ns_.id, exports, global);';


    source = source.replace(/var _ns_[^;]+;/, injectStr);

    return {
      source: source,
      sourceMap: JSON.stringify(sourceMapJSON)
    };
  };

  var wrapExports = function (source, sourceMap) {
    if (sourceMap)
      var sourceMapJSON = JSON.parse(sourceMap);

    var header = ';(function (exports) {',
        footer = '})(this);';

    source = header + source + footer;
    return {
      source: source,
      sourceMap: JSON.stringify(sourceMapJSON)
    };
  };

  var code = output.code,
      sourceMap = JSON.stringify(output['source-map']);

  var wrapped = wrapExports(code, sourceMap);
  code = wrapped.source;
  sourceMap = wrapped.sourceMap;

  // if (isBrowser) {
  var nsed = meteorWispNS(code, sourceMap);
  code = nsed.source;
  sourceMap = nsed.sourceMap;
  // }

  compileStep.addJavaScript({
      path: outputFile,
      sourcePath: compileStep.inputPath,
      data: code,
      sourceMap: sourceMap,
      bare: isBrowser
  });

};

Plugin.registerSourceHandler("wisp", handler);
