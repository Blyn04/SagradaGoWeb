import { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../context/AllContext";
import "../../styles/booking/wedding.css";
import default_profile from "../../assets/no-image.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import no_image from "../../assets/blank-image.jpg";
import { supabase } from "../../config/supabase";
import axios from "axios";
import { API_URL } from "../../Constants";



export default function Wedding() {
  const { currentUser, bookingSelected, setBookingSelected } =
    useContext(NavbarContext);

  // TO BE DELETE
  const occupiedDates = [
    new Date("2025-11-27"),
    new Date("2025-11-28"),
    new Date("2025-11-29"),
    new Date("2025-11-30"),
    new Date("2025-12-04"),
  ];

  //-------------------




  const [groomFname, setGroomFname] = useState("");
  const [groomMname, setGroomMname] = useState("");
  const [groomLname, setGroomLname] = useState("");
  const [brideFname, setBrideFname] = useState("");
  const [brideMname, setBrideMname] = useState("");
  const [brideLname, setBrideLname] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [contact, setContact] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [email, setEmail] = useState("");

  const inputText = [
    {
      key: "groom_first",
      title: "Groom First Name",
      type: "text",
      onChange: setGroomFname,
      value: groomFname,
    },
    {
      key: "groom_middle",
      title: "Groom Middle Name",
      type: "text",
      onChange: setGroomMname,
      value: groomMname,
    },
    {
      key: "groom_last",
      title: "Groom Last Name",
      type: "text",
      onChange: setGroomLname,
      value: groomLname,
    },
    { key: "date", title: "Date", type: "date", onChange: setDate },

    {
      key: "bride_first",
      title: "Bride First Name",
      type: "text",
      onChange: setBrideFname,
      value: brideFname,
    },
    {
      key: "bride_middle",
      title: "Bride Middle Name",
      type: "text",
      onChange: setBrideMname,
      value: brideMname,
    },
    {
      key: "bride_last",
      title: "Bride Last Name",
      type: "text",
      onChange: setBrideLname,
      value: brideLname,
    },
    {
      key: "time",
      title: "Time",
      type: "time",
      onChange: setTime,
      value: time,
    },

    {
      key: "email",
      title: "Email",
      type: "email",
      onChange: setEmail,
      value: email,
    },

    {
      key: "contact_number",
      title: "Contact Number",
      type: "text",
      onChange: setContact,
      value: contact,
    },
    {
      key: "attendees",
      title: "Attendees",
      type: "number",
      onChange: setAttendees,
      value: attendees,
    },
  ];

  const [groomFile, setGroomFile] = useState(null);
  const [brideFile, setBrideFile] = useState(null);

  const [groomPreview, setGroomPreview] = useState("");
  const [bridePreview, setBridePreview] = useState("");

  const [groomPhoto, setGroomPhoto] = useState("");
  const [bridePhoto, setBridePhoto] = useState("");

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

    const { data } = supabase.storage.from("wedding").getPublicUrl(filePath);

    setter(data.publicUrl);
  }

  const uploadProfileImage = [
    {
      key: "groom_1x1",
      title: "Groom Photo",
      fileSetter: setGroomFile,
      preview: groomPreview,
      previewSetter: setGroomPreview,
    },
    {
      key: "bride_1x1",
      title: "Bride Photo",
      fileSetter: setBrideFile,
      preview: bridePreview,
      previewSetter: setBridePreview,
    },
  ];

  const [groomBapFile, setGroomBapFile] = useState(null);
  const [brideBapFile, setBrideBapFile] = useState(null);

  const [groomBapPreview, setGroomBapPreview] = useState("");
  const [brideBapPreview, setBrideBapPreview] = useState("");

  const [groomBaptismal, setGroomBaptismal] = useState("");
  const [brideBaptismal, setBrideBaptismal] = useState("");

  const uploadBaptismal = [
    {
      key: "groom_baptismal",
      title: "Groom Baptismal Certificate Photo",
      fileSetter: setGroomBapFile,
      preview: groomBapPreview,
      previewSetter: setGroomBapPreview,
    },
    {
      key: "bride_baptismal",
      title: "Bride Baptismal Certificate Photo",
      fileSetter: setBrideBapFile,
      preview: brideBapPreview,
      previewSetter: setBrideBapPreview,
    },
  ];

  const [groomConfFile, setGroomConfFile] = useState(null);
  const [brideConfFile, setBrideConfFile] = useState(null);

  const [groomConfPreview, setGroomConfPreview] = useState("");
  const [brideConfPreview, setBrideConfPreview] = useState("");

  const [groomConfirmation, setGroomConfirmation] = useState("");
  const [brideConfirmation, setBrideConfirmation] = useState("");

  const uploadConfirmation = [
    {
      key: "groom_confirmation",
      title: "Groom Confirmation Certificate Photo",
      fileSetter: setGroomConfFile,
      preview: groomConfPreview,
      previewSetter: setGroomConfPreview,
    },
    {
      key: "bride_confirmation",
      title: "Bride Confirmation Certificate Photo",
      fileSetter: setBrideConfFile,
      preview: brideConfPreview,
      previewSetter: setBrideConfPreview,
    },
  ];

  const [groomCenomarFile, setGroomCenomarFile] = useState(null);
  const [brideCenomarFile, setBrideCenomarFile] = useState(null);

  const [groomCenomarPreview, setGroomCenomarPreview] = useState("");
  const [brideCenomarPreview, setBrideCenomarPreview] = useState("");

  const [groomCenomar, setGroomCenomar] = useState("");
  const [brideCenomar, setBrideCenomar] = useState("");

  const uploadCenomar = [
    {
      key: "groom_cenomar",
      title: "Groom CENOMAR Photo",
      fileSetter: setGroomCenomarFile,
      preview: groomCenomarPreview,
      previewSetter: setGroomCenomarPreview,
    },
    {
      key: "bride_cenomar",
      title: "Bride CENOMAR Photo",
      fileSetter: setBrideCenomarFile,
      preview: brideCenomarPreview,
      previewSetter: setBrideCenomarPreview,
    },
  ];

  const [groomPermFile, setGroomPermFile] = useState(null);
  const [bridePermFile, setBridePermFile] = useState(null);

  const [groomPermPreview, setGroomPermPreview] = useState("");
  const [bridePermPreview, setBridePermPreview] = useState("");

  const [groomPermission, setGroomPermission] = useState("");
  const [bridePermission, setBridePermission] = useState("");

  const uploadPermission = [
    {
      key: "groom_permission",
      title: "Groom Permission Photo",
      fileSetter: setGroomPermFile,
      preview: groomPermPreview,
      previewSetter: setGroomPermPreview,
    },
    {
      key: "bride_permission",
      title: "Bride Permission Photo",
      fileSetter: setBridePermFile,
      preview: bridePermPreview,
      previewSetter: setBridePermPreview,
    },
  ];

  const [marriageDocuFile, setMarriageDocuFile] = useState(null);
  const [marriagePreview, setMarriagePreview] = useState("");
  const [marriageDocu, setMarriageDocu] = useState("");

  const uploadMarriageDocu = [
    {
      key: "marriage_docu",
      title: "Marriage Document",
      fileSetter: setMarriageDocuFile,
      preview: marriagePreview,
      previewSetter: setMarriagePreview,
    },
  ];

  const [isCivil, setIsCivil] = useState("");
  const civil_choices = [
    { text: "Yes", value: "yes" },
    { text: "No", value: "no" },
  ];

  function generateTransactionID() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
    return `TX-${timestamp}-${random}`;
  }


  async function handleUpload() {

    if (
      !date ||
      !time ||
      attendees <= 0 ||
      contact.trim() === "" ||
      groomFname.trim() === "" ||
      groomLname.trim() === "" ||
      brideFname.trim() === "" ||
      brideLname.trim() === ""
    ) {
      alert("Please fill all input fields.");
      return;
    }


    if (
      !groomFile &&
      !brideFile &&
      !groomBapFile &&
      !brideBapFile &&
      !groomConfFile &&
      !brideConfFile &&
      !groomCenomarFile &&
      !brideCenomarFile &&
      !groomPermFile &&
      !bridePermFile &&
      !marriageDocuFile
    ) {
      alert("Please select files first.");
      return;
    }



    if (marriageDocuFile) {
      await uploadImage(marriageDocuFile, `marriage_docu`, setMarriageDocu);
    }

    if (bridePermFile) {
      await uploadImage(bridePermFile, `bride_permission`, setBridePermission);
    }

    if (groomPermFile) {
      await uploadImage(groomPermFile, `groom_permission`, setGroomPermission);
    }

    if (groomCenomarFile) {
      await uploadImage(groomCenomarFile, `groom_cenomar`, setGroomCenomar);
    }

    if (brideCenomarFile) {
      await uploadImage(brideCenomarFile, `bride_cenomar`, setBrideCenomar);
    }

    if (groomFile) {
      await uploadImage(groomFile, `groom_photo`, setGroomPhoto);
    }

    if (brideFile) {
      await uploadImage(brideFile, `bride_photo`, setBridePhoto);
    }

    if (groomBapFile) {
      await uploadImage(groomBapFile, `groom_baptismal`, setGroomBaptismal);
    }

    if (brideBapFile) {
      await uploadImage(brideBapFile, `groom_baptismal`, setBrideBaptismal);
    }

    if (groomConfFile) {
      await uploadImage(
        groomConfFile,
        `groom_confirmation`,
        setGroomConfirmation
      );
    }

    if (brideConfFile) {
      await uploadImage(
        brideConfFile,
        `bride_confirmation`,
        setBrideConfirmation
      );
    }

    alert("Upload success!");

    axios.post(`${API_URL}/createWeddingBooking`, {
      uid: "123123123",
      email: email,
      transaction_id: generateTransactionID(),
      date: date,
      time: time,
      attendees: attendees,
      contact_number: contact,
      groom_last_name: groomLname,
      groom_first_name: groomFname,
      groom_middle_name: groomMname,
      groom_pic: groomPhoto,
      bride_last_name: brideLname,
      bride_first_name: brideFname,
      bride_middle_name: brideMname,
      bride_pic: bridePhoto,
      marriage_docu: marriageDocu,
      groom_cenomar: groomCenomar,
      bride_cenomar: brideCenomar,
      groom_baptismal_cert: groomBaptismal,
      bride_baptismal_cert: brideBaptismal,
      groom_confirmation_cert: groomConfirmation,
      bride_confirmation_cert: brideConfirmation,
      groom_permission: groomPermission,
      bride_permission: bridePermission,
    })




    console.log(date)
    console.log(time)
    console.log(groomPhoto)
    console.log(bridePhoto)
    console.log(marriageDocu)
    console.log(groomBaptismal)
    console.log(brideBaptismal)
    console.log(groomConfirmation)
    console.log(brideConfirmation)
    console.log(groomCenomar)
    console.log(brideCenomar)
    console.log(groomPermission)
    console.log(bridePermission)
  }

 


  return (
    <div className="main-holder">
      <div className="form-container">
      {inputText.map((elem) => (
        <div className="flex flex-col" key={elem.key}>
          <h1>{elem.title}</h1>

          {elem.type === "date" ? (
            <>
              <DatePicker
                selected={date ? new Date(date) : null}
                onChange={(v) => setDate(v ? v.toISOString() : "")}
                className="input-text"
                dateFormat="yyyy-MM-dd"
                excludeDates={occupiedDates}
              />
            </>
          ) : elem.type === "time" ? (
            <div className="time-container">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={time ? dayjs(`2000-01-01 ${time}`) : null}
                  onChange={(v) => {
                    setTime(v ? dayjs(v).format("HH:mm") : "");
                  }}
                  slotProps={{
                    textField: {
                      className: "time-slot-props",
                      InputProps: {
                        sx: {
                          padding: 0,
                          height: "100%",
                          "& fieldset": { border: "none" },
                        },
                      },
                      sx: {
                        padding: 0,
                        margin: 0,
                        height: "100%",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          padding: 0,
                        },
                        "& .MuiInputBase-input": {
                          height: "100%",
                          padding: 0,
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          ) : (
            <>
              <input
                name={elem.key}
                type={elem.type}
                className="input-text"
                onChange={(e) => elem.onChange(e.target.value)}
                value={elem.value}
              />
            </>
          )}
        </div>
      ))}

      </div>
      <div className="upload-container">

      {uploadProfileImage.map((elem) => (
        <div key={elem.key} className="per-grid-container">
          <div>
            <h1 className="text-center">{elem.title}</h1>

            <input
            type="file"
            accept="image/*"
            className="inputFile-properties"
            onChange={(e) => {
              const file = e.target.files[0];
              elem.fileSetter(file);

              if (file) {
                elem.previewSetter(URL.createObjectURL(file));
              }
            }}
          />
          </div>

          <div className="image-container">
            
            <img
              src={elem.preview ? elem.preview : no_image}
              alt="Preview"
              className="image-preview"
            />
          </div>
        </div>
      ))}

      {uploadBaptismal.map((elem) => (
        <div key={elem.key} className="per-grid-container">
          <div>
            <h1>{elem.title}</h1>

            <input
              type="file"
              accept="image/*"
              className="inputFile-properties"
              onChange={(e) => {
                const file = e.target.files[0];
                elem.fileSetter(file);

                if (file) {
                  elem.previewSetter(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="image-container">
            
            <img
              src={elem.preview ? elem.preview : no_image}
              alt="Preview"
              className="image-preview"
            />
          </div>
        </div>
      ))}

      {uploadConfirmation.map((elem) => (
        <div key={elem.key} className="per-grid-container">
          <div>
            <h1>{elem.title}</h1>

            <input
              type="file"
              accept="image/*"
              className="inputFile-properties"
              onChange={(e) => {
                const file = e.target.files[0];
                elem.fileSetter(file);

                if (file) {
                  elem.previewSetter(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="image-container">
            
            <img
              src={elem.preview ? elem.preview : no_image}
              alt="Preview"
              className="image-preview"
            />
          </div>
        </div>
      ))}

      {uploadCenomar.map((elem) => (
        <div key={elem.key} className="per-grid-container">
          <div>
            <h1>{elem.title}</h1>

            <input
              type="file"
              accept="image/*"
              className="inputFile-properties"
              onChange={(e) => {
                const file = e.target.files[0];
                elem.fileSetter(file);

                if (file) {
                  elem.previewSetter(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="image-container">
            
            <img
              src={elem.preview ? elem.preview : no_image}
              alt="Preview"
              className="image-preview"
            />
          </div>
        </div>
      ))}

      {uploadPermission.map((elem) => (
        <div key={elem.key} className="per-grid-container">
          <div>
            <h1>{elem.title}</h1>

            <input
              type="file"
              accept="image/*"
              className="inputFile-properties"
              onChange={(e) => {
                const file = e.target.files[0];
                elem.fileSetter(file);

                if (file) {
                  elem.previewSetter(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="image-container">
            
            <img
              src={elem.preview ? elem.preview : no_image}
              alt="Preview"
              className="image-preview"
            />
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <p>Are you civilly married?</p>

        <div className="flex w-auto gap-10">
          {civil_choices.map((elem) => (
            <div className="flex gap-1">
              <input
                type="radio"
                name="civil"
                
                value={elem.value}
                onChange={() => setIsCivil(elem.text)}
              />
              <span>{elem.text}</span>
            </div>
          ))}
        </div>

        {isCivil === "" ? (
          <></>
        ) : isCivil === "Yes" ? (
          uploadMarriageDocu.map((elem) => (
            <div key={elem.key} className="per-grid-container">
              <div>
                <h1>Upload Marriage Contract</h1>

                <input
                  type="file"
                  accept="image/*"
                  className="inputFile-properties"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    elem.fileSetter(file);

                    if (file) {
                      elem.previewSetter(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>

              <div className="image-container">
                
                <img
                  src={elem.preview ? elem.preview : no_image}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            </div>
          ))
        ) : (
          uploadMarriageDocu.map((elem) => (
            <div key={elem.key} className="per-grid-container">
              <div>
                <h1>Upload Marriage License</h1>

                <input
                  type="file"
                  accept="image/*"
                  className="inputFile-properties"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    elem.fileSetter(file);

                    if (file) {
                      elem.previewSetter(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>

              <div className="image-container">
                
                <img
                  src={elem.preview ? elem.preview : no_image}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            </div>
          ))
        )}
      </div>

      
    </div>

    <input
        type="submit"
        value="Submit"
        className="submit-button"
        onClick={handleUpload}
      />
    </div>
  );
}
