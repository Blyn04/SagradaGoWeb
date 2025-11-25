import { useContext, useState } from "react";
import { NavbarContext } from "../../context/AllContext";
import "../../styles/booking/wedding.css"
import default_profile from "../../assets/no-image.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Wedding() {
  const { currentUser } = useContext(NavbarContext);

  const [form, setForm] = useState({
    uid: currentUser?.uid || "",
    date: "",
    time: "",
    attendees: "",
    contact_number: "",
    groom_first: "",
    groom_middle: "",
    groom_last: "",
    bride_first: "",
    bride_middle: "",
    bride_last: "",
    groom_1x1: null,
    bride_1x1: null,
    marriage_license: null,
    marriage_contract: null,
    groom_baptismal_cert: null,
    bride_baptismal_cert: null,
    groom_confirmation_cert: null,
    bride_confirmation_cert: null,
    groom_cenomar: null,
    bride_cenomar: null,
    groom_banns: null,
    bride_banns: null,
    groom_permission: null,
    bride_permission: null,
  });



  const inputText = [
    { key: "groom_first", title: "Groom First Name", type: "text" },
    { key: "groom_middle", title: "Groom Middle Name", type: "text" },
    { key: "groom_last", title: "Groom Last Name", type: "text" },
    { key: "date", title: "Date", type: "date" },

    { key: "bride_first", title: "Bride First Name", type: "text" },
    { key: "bride_middle", title: "Bride Middle Name", type: "text" },
    { key: "bride_last", title: "Bride Last Name", type: "text" },
    { key: "time", title: "Time", type: "time" },

    { key: "contact_number", title: "Contact Number", type: "text" },
    { key: "attendees", title: "Attendees", type: "number" },
  ];

  const uploadProfileImage = [
    { key: "groom_1x1", title: "Groom Photo" },
    { key: "bride_1x1", title: "Bride Photo" },
  ];

  const occupiedDates = [
    new Date("2025-11-27"),
    new Date("2025-11-28"),
    new Date("2025-11-29"),
    new Date("2025-11-30"),
    new Date("2025-12-01"),
  ];


  return (

    <form className="w-full bg-green-400 grid grid-cols-4 p-10! gap-4">
      {inputText.map((elem) => (
        <div className="flex flex-col" key={elem.key}>
          <h1>{elem.title}</h1>

          {elem.type === "date" ? (
            <DatePicker
              selected={form.date ? new Date(form.date) : null}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, date: v ? v.toISOString() : "" }))
              }
              className="input-text"
              dateFormat="yyyy-MM-dd"
              excludeDates={occupiedDates}  
            />
          ) : elem.type === "time" ? (
            <div className="w-10/12 h-8 bg-white border border-black px-5! flex items-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={form.time ? dayjs(form.time) : null}
                  // onChange={(v) =>
                  //   setForm((prev) => ({
                  //     ...prev,
                  //     time: v ? v.toISOString() : "",
                  //   }))
                  // }
                  slotProps={{
                    textField: {
                      className: "w-full h-full bg-white p-0 m-0",
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
                        "&:hover fieldset": {
                          border: "none !important",
                        },
                        "&.Mui-focused fieldset": {
                          border: "none !important", 
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          ) : (
            <input
              name={elem.key}
              type={elem.type}
              className="input-text"
              value={form[elem.key] || ""}
              // onChange={handleChange}
            />
          )}
        </div>
      ))}

      {uploadProfileImage.map((elem) => (
        <div className="grid grid-cols-[3fr_1fr]" key={elem.key}>
          <div>
            <label className="block text-sm font-medium mb-1">
              {elem.title}
            </label>

            <input
              type="file"
              accept="image/*"
              name={elem.key}
              // onChange={handleFileChange}
            />

            {/* <p className="text-xs mt-1">{fileLabel(form[elem.key])}</p> */}
          </div>

          <img src={default_profile} alt="no-profile" className="w-15" />
        </div>
      ))}
    </form>

    // <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
    //   <h2 className="text-2xl font-semibold mb-4">Wedding Booking</h2>

    //   {Object.keys(errors).length > 0 && (
    //     <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
    //       Please fix the highlighted fields below.
    //     </div>
    //   )}

    //   {serverError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{serverError}</div>}
    //   {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{successMsg}</div>}

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Contact Number</label>
    //       <input name="contact_number" value={form.contact_number} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.contact_number ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.contact_number && <p className="text-xs text-red-500 mt-1">{errors.contact_number}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Wedding Date</label>
    //       <input type="date" name="date" value={form.date} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Wedding Time</label>
    //       <input type="time" name="time" value={form.time} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.time ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Number of Attendees</label>
    //       <input type="number" min="1" name="attendees" value={form.attendees} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.attendees ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.attendees && <p className="text-xs text-red-500 mt-1">{errors.attendees}</p>}
    //     </div>

    //     <div></div>

    //     <div className="md:col-span-1">
    //       <label className="block text-sm font-medium mb-1">Groom Fullname</label>
    //       <input name="groom_fullname" value={form.groom_fullname} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.groom_fullname ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.groom_fullname && <p className="text-xs text-red-500 mt-1">{errors.groom_fullname}</p>}
    //     </div>

    //     <div className="md:col-span-1">
    //       <label className="block text-sm font-medium mb-1">Bride Fullname</label>
    //       <input name="bride_fullname" value={form.bride_fullname} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.bride_fullname ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.bride_fullname && <p className="text-xs text-red-500 mt-1">{errors.bride_fullname}</p>}
    //     </div>
    //   </div>

    //   <hr className="my-6" />

    //   <h3 className="text-lg font-medium mb-3">Photos & Core Documents</h3>

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom 1x1 Photo</label>
    //       <input type="file" accept="image/*" name="groom_1x1" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_1x1)}</p>
    //       {errors.groom_1x1 && <p className="text-xs text-red-500 mt-1">{errors.groom_1x1}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride 1x1 Photo</label>
    //       <input type="file" accept="image/*" name="bride_1x1" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_1x1)}</p>
    //       {errors.bride_1x1 && <p className="text-xs text-red-500 mt-1">{errors.bride_1x1}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Marriage License (optional if contract provided)</label>
    //       <input type="file" name="marriage_license" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.marriage_license)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Marriage Contract</label>
    //       <input type="file" name="marriage_contract" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.marriage_contract)}</p>
    //     </div>
    //   </div>

    //   <hr className="my-6" />

    //   <h3 className="text-lg font-medium mb-3">Certificates & Additional Documents</h3>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Baptismal Certificate</label>
    //       <input type="file" name="groom_baptismal_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_baptismal_cert)}</p>
    //       {errors.groom_baptismal_cert && <p className="text-xs text-red-500 mt-1">{errors.groom_baptismal_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Baptismal Certificate</label>
    //       <input type="file" name="bride_baptismal_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_baptismal_cert)}</p>
    //       {errors.bride_baptismal_cert && <p className="text-xs text-red-500 mt-1">{errors.bride_baptismal_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Confirmation Certificate</label>
    //       <input type="file" name="groom_confirmation_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_confirmation_cert)}</p>
    //       {errors.groom_confirmation_cert && <p className="text-xs text-red-500 mt-1">{errors.groom_confirmation_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Confirmation Certificate</label>
    //       <input type="file" name="bride_confirmation_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_confirmation_cert)}</p>
    //       {errors.bride_confirmation_cert && <p className="text-xs text-red-500 mt-1">{errors.bride_confirmation_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom CENOMAR (optional)</label>
    //       <input type="file" name="groom_cenomar" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_cenomar)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride CENOMAR (optional)</label>
    //       <input type="file" name="bride_cenomar" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_cenomar)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Banns / Permission</label>
    //       <input type="file" name="groom_banns" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_banns)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Banns / Permission</label>
    //       <input type="file" name="bride_banns" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_banns)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Permission (if applicable)</label>
    //       <input type="file" name="groom_permission" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_permission)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Permission (if applicable)</label>
    //       <input type="file" name="bride_permission" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_permission)}</p>
    //     </div>
    //   </div>

    //   <div className="mt-6 flex items-center gap-3">
    //     <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
    //       {submitting ? "Submitting..." : "Create Booking"}
    //     </button>

    //     <button type="button" onClick={() => {
    //       setForm({
    //         uid: "",
    //         date: "",
    //         time: "",
    //         attendees: "",
    //         contact_number: "",
    //         groom_fullname: "",
    //         bride_fullname: "",
    //         marriage_license: null,
    //         marriage_contract: null,
    //         groom_1x1: null,
    //         bride_1x1: null,
    //         groom_baptismal_cert: null,
    //         bride_baptismal_cert: null,
    //         groom_confirmation_cert: null,
    //         bride_confirmation_cert: null,
    //         groom_cenomar: null,
    //         bride_cenomar: null,
    //         groom_banns: null,
    //         bride_banns: null,
    //         groom_permission: null,
    //         bride_permission: null,
    //       });
    //       setErrors({});
    //       setServerError("");
    //       setSuccessMsg("");
    //     }} className="px-4 py-2 border rounded">Reset</button>
    //   </div>

    // </form>
  );
}
