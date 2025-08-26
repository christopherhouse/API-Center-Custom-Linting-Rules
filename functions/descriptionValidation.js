// functions/alnumDescription.js
export default (input, options, context) => {
  const results = [];

  if (typeof input !== "string") {
    results.push({
      message: `Description must be a string.`,
      path: context.path
    });
    return results;
  }

  // Check length
  if (input.length >= 20) {
    results.push({
      message: `Description is too long (${input.length} chars). Must be < 20.`,
      path: context.path
    });
  }

  // Check alphanumeric only
  if (!/^[A-Za-z0-9]+$/.test(input)) {
    results.push({
      message: `Description must be alphanumeric only. Found: "${input}"`,
      path: context.path
    });
  }

  return results;
};
