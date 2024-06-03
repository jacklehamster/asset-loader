export function isImage(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  return ext === "png" || ext === "jpg" || ext === "jpeg" || ext==="gif" || ext==="svg";
}
