

module.exports = function (api) {
   api.cache(true);

   const presets = [
      ["@babel/preset-env",
      {
         //"useBuiltIns": "usage",
         //"corejs": 3,
         "targets": "last 1 chrome version"
      }],
      "@babel/preset-react"
   ];
   //const plugins = [ ... ];

   return {
      presets,
      //plugins
   };
};