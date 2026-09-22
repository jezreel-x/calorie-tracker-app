// Date.now() was the previous id source, which collides when two items are
// added inside the same millisecond — easy to do by holding down Enter.
const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default makeId;
