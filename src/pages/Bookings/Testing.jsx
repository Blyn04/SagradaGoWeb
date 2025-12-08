import { useState } from "react";
import { supabase } from "../../config/supabase";

export default function Testing() {
  // Separate file states
  const [groomFile, setGroomFile] = useState(null);
  const [brideFile, setBrideFile] = useState(null);

  // Separate uploaded URLs
  const [groomPhoto, setGroomPhoto] = useState("");
  const [bridePhoto, setBridePhoto] = useState("");

  // Reusable upload function
  async function uploadImage(file, namePrefix, setter) {
    const ext = file.name.split(".").pop();
    const fileName = `${namePrefix}_${Date.now()}.${ext}`;
    const filePath = `wedding/${fileName}`;

    const { error } = await supabase.storage
      .from("wedding")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload Error:", error);
      alert("Upload failed.");
      return;
    }

    const { data } = supabase.storage
      .from("wedding")
      .getPublicUrl(filePath);

    setter(data.publicUrl);
  }

  async function handleUpload() {
    if (!groomFile && !brideFile) {
      alert("Please select files first.");
      return;
    }

    if (groomFile) {
      await uploadImage(groomFile, "groom_photo", setGroomPhoto);
    }

    if (brideFile) {
      await uploadImage(brideFile, "bride_photo", setBridePhoto);
    }

    alert("Upload success!");
  }

  const uploadProfileImage = [
    {
      key: "groom_1x1",
      title: "Groom Photo",
      fileSetter: setGroomFile,
      preview: groomPhoto,
    },
    {
      key: "bride_1x1",
      title: "Bride Photo",
      fileSetter: setBrideFile,
      preview: bridePhoto,
    },
  ];

  return (
    <>
      {uploadProfileImage.map((elem) => (
        <div key={elem.key} style={{ marginBottom: "20px" }}>
          <h1>{elem.title}</h1>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => elem.fileSetter(e.target.files[0])}
          />

          {elem.preview && (
            <div>
              <h3>Uploaded Image:</h3>
              <img src={elem.preview} alt="Uploaded" width={200} />
            </div>
          )}
        </div>
      ))}

      <button onClick={handleUpload}>Upload</button>
    </>
  );
}
