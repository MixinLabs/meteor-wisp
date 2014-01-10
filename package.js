Package.describe({
  summary: "wisp is a homoiconic JavaScript dialect with Clojure syntax, s-expressions and macros."
});

Package._transitional_registerBuildPlugin({
  name: "compileWisp",
  use: [],
  sources: [
    'plugin/compile-wisp.js'
  ],
  npmDependencies: {"wisp": "0.9.0-beta3"}
});

