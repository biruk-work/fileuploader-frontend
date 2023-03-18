import axios from "axios";
import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_KEY_API_URL;

const App = () => {
  const [name, setName] = useState();
  const [fileName, setFileName] = useState();
  const [file, setFile] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [data, setData] = useState([]);

  const uploadFile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("uploader", name);

    await axios({
      method: "post",
      url: API_URL + "/api/file/upload",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((_res) => {
        setName("");
        setFileName("");
        setMessage("File uploaded successfully to the server!");
        setError("");
        getData();
      })
      .catch((err) => {
        setError("Opps! Something went wrong");
        setMessage("");
      });
  };

  const getData = async () => {
    await axios
      .get(API_URL + "/api/file/get-files")
      .then((res) => {
        console.log(res.data);
        setData(res.data.files);
      })
      .catch((err) => {
        setError("Opps! Something went wrong");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      "Bytes",
      "KiB",
      "MiB",
      "GiB",
      "TiB",
      "PiB",
      "EiB",
      "ZiB",
      "YiB",
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  const deleteFile = async (id) => {
    await axios
      .delete(API_URL + "/api/file/delete-file/" + id)
      .then((_res) => {
        setMessage("File deleted from the server successfully");
      })
      .catch((_err) => {
        setError("Opps! Something went wrong");
      });
    getData();
  };

  return (
    <div className="dark:bg-zinc-800 h-screen pt-3 pl-4 pr-4">
      <h1 className="py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        Upload File
      </h1>
      {error && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">{error}</span>
        </div>
      )}
      {message && (
        <div
          class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span class="font-medium">{message}</span>
        </div>
      )}
      <center>
        <form onSubmit={uploadFile}>
          <input
            className="block mt-2 mb-2 p-3 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          ></input>
          <input
            className="block mt-4 py-3 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            accept="image/*"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              setFile(e.target.files[0]);
            }}
            required
          ></input>
          <div>
            <p
              className="mt-2 mb-1 text-left text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 10MB)
            </p>
          </div>

          <button
            type="submit"
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-3 mt-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Submit
          </button>
        </form>
      </center>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                File name
              </th>
              <th scope="col" className="px-6 py-3">
                Size
              </th>
              <th scope="col" className="px-6 py-3">
                Uploaded Date
              </th>
              <th scope="col" className="px-6 py-3">
                Uploader
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {r.filename}
                </th>
                <td className="px-6 py-4">{formatBytes(r.filesize)}</td>
                <td className="px-6 py-4">{r.createdAt}</td>
                <td className="px-6 py-4">{r.uploader}</td>
                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => {
                      deleteFile(r.id);
                    }}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
