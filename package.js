Package.describe({
  name: "nsmeta:wisp",
  summary: "wisp is a homoiconic JavaScript dialect with Clojure syntax, s-expressions and macros.",
  version: "0.10.0_1",
  git: "https://github.com/MixinLabs/meteor-wisp.git"
});


Package.registerBuildPlugin({
  name: "compileWisp",
  use: [],
  sources: [
    'plugin/compile-wisp.js'
  ],
  npmDependencies: {"wisp": "0.10.0"}
});

Package.onUse(function (api) {
  api.addFiles(['wispNamespace.js'], ['client', 'server']);
  api.export(['__wisp__'], ['client', 'server']);
});
