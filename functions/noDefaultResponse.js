// functions/forbidDefault.js
export default (input, options, context) => {
  if (!input || typeof input !== "object") {
    return [];
  }

  if (Object.keys(input).includes("default")) {
    return [
      {
        message: "Avoid 'default' response; use explicit status codes.",
        path: context.path
      }
    ];
  }

  return [];
};
