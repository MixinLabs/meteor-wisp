var wisp = Npm.require('wisp/compiler');

var handler = function (compileStep) {
  console.log(compileStep);
  var source = compileStep.read().toString('utf-8');
  var outputFile = compileStep.inputPath + '.js';

  try {
    var output = wisp.compile(source, { sourceMaps: true });
  } catch (e) {
    throw new Error(
          compileStep.inputPath + ':' +
          (e.location ? (e.location.first_line + ': ') : ' ') +
          e.message
        );
  }

  var wrapExports = function (source, sourceMap) {
    var sourceMapJSON = sourceMap;

    var header = ';(function (exports) {',
        footer = '})(this);';

    source = header + source + footer;
    return {
      source: source,
      sourceMap: JSON.stringify(sourceMapJSON)
    };
  };

  var wrapped = wrapExports(output.code, output['source-map']);

  compileStep.addJavaScript({
      path: outputFile,
      sourcePath: compileStep.inputPath,
      data: wrapped.source,
      sourceMap: wrapped.sourceMap,
      bare: (compileStep.arch === 'browser' ? true : false)
  });

};

Plugin.registerSourceHandler("wisp", handler);