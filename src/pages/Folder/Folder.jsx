import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRedirectIfNotAuthenticated } from "../../hooks/useRedirectIfNotAuthenticated";
import styles from './Folder.module.css';

function Folder() {
  const { folderId } = useParams();

  // Files from the hook
  const { data: initialFiles = [], isLoading: filesLoading } = useRedirectIfNotAuthenticated(`folders/${folderId}/files`);

  // Local state for files
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Populate local files state when hook data arrives
  useEffect(() => {
    setFiles(initialFiles);
    console.log("initial files",initialFiles)
  }, [initialFiles]);

  // Fetch folder info
  useEffect(() => {
    async function fetchFolder() {
      const res = await fetch(`${import.meta.env.VITE_DEV_API_URL}folders/${folderId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data)
      setFolder(data.data);
    }

    fetchFolder();
  }, [folderId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onDelete = async (fileId) => {
    console.log("Deleted", fileId);
    const url = `${import.meta.env.VITE_DEV_API_URL}folders/${folderId}/files/${fileId}`
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
    const data = await response.json();

    setFiles(files.filter(file => file.id !== data.data.id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch(`${import.meta.env.VITE_DEV_API_URL}folders/${folderId}/files`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
        console.log(data)
      // Append the new file to local files state
      setFiles(prev => [...prev, data.data]);
      setSelectedFile(null);
    }
  };

  if (filesLoading || !folder) return <div>Loading...</div>;

  return (
    <>
      <h2>Folder: {folder.name}</h2>

      <h3>Files:</h3>
      <div className={styles.fileGrid}>
        {files && files.map((file) => (
          <div key={file.id} className={styles.fileCard}>
            <img className={styles.fileImage} src={file.url} alt={file.name} />
            <div className={styles.fileName}>{file.name}</div>
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(file.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <label htmlFor="file">Choose a file:</label>
        <input type="file" id="file" name="file" required onChange={handleFileChange} />
        <button type="submit">Upload File</button>
      </form>
    </>
  );
}

export default Folder;
