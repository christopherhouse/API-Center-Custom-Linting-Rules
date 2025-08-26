// functions/requireJsonExamples.js
export default (input, options, context) => {
  const results = [];

  // input is the requestBody object
  if (!input || typeof input !== "object") {
    return results;
  }

  const content = input.content || {};
  const jsonContent = content["application/json"];
  if (!jsonContent) {
    return results; // no application/json -> nothing to check
  }

  // Check for `example` or `examples`
  if (!("example" in jsonContent) && !("examples" in jsonContent)) {
    results.push({
      message: "application/json requestBody must include an example or examples.",
      path: context.path.concat(["content", "application/json"])
    });
  }

  return results;
};
