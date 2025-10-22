import { fetchWithAuth } from "./fecthWithAuth";

export const uploadImageToCloudinary = async (file, type) => {
  if (!file) throw new Error("No se proporcionó ningún archivo");
  if (file.type !== "image/webp")
    throw new Error("Solo se permiten imágenes .webp");

  const folder =
    type === "region"
      ? "regions"
      : type === "character"
      ? "characters"
      : "others";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "app_upload");
  formData.append("folder", folder);

  const cloudName = "dpylotukc";

  const res = await fetchWithAuth(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Error al subir imagen a Cloudinary");

  const data = await res.json();
  return data.secure_url;
};
