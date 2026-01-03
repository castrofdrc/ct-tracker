export function deriveCameraState(operations = []) {
  if (!Array.isArray(operations) || operations.length === 0) {
    return "inactive";
  }

  const toMillis = (d) => {
    if (!d) return 0;
    if (typeof d.toMillis === "function") return d.toMillis();
    if (d instanceof Date) return d.getTime();
    if (typeof d === "number") return d;
    return 0;
  };

  const last = [...operations]
    .filter((op) => op && op.type)
    .sort((a, b) => toMillis(a.createdAt) - toMillis(b.createdAt))
    .at(-1);

  if (!last) return "inactive";

  switch (last.type) {
    case "deploy":
      return "inactive";

    case "placement":
    case "relocation":
    case "maintenance":
      return "active";

    case "removal":
      return "inactive";

    default:
      return "inactive";
  }
}
