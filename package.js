Package.describe({
  summary: "wisp is a homoiconic JavaScript dialect with Clojure syntax, s-expressions and macros."
});


Package._transitional_registerBuildPlugin({
  name: "compileWisp",
  use: [],
  sources: [
    'plugin/compile-wisp.js'
  ],
  npmDependencies: {"wisp": "0.10.0"}
});

Package.on_use(function (api) {
  api.add_files(['wispNamespace.js'], ['client', 'server']);
  api.export(['__wisp__'], ['client', 'server']);
});
