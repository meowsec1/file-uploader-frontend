import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SharedFolder.module.css';

function SharedFolder() {
  const { hash } = useParams();
  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        const url = `${import.meta.env.VITE_DEV_API_URL}share/${hash}`
        const response = await fetch(url);

        const data = await response.json();

        console.log(data);

        setFolderData(data.data);
        setLoading(false);
    }
    fetchData();

  }, [hash]);

  if (loading) return <div>Loading...</div>;
  if (!folderData) return <div>Link expired or invalid</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{folderData.name}</h1>
      
      <div className={styles.fileGrid}>
        {folderData.files && folderData.files.length > 0 ? (
          folderData.files.map(file => (
            <div key={file.id} className={styles.fileCard}>
              <img 
                src={file.url} 
                alt={file.name}
                className={styles.fileImage}
              />
              <div className={styles.fileName}>{file.name}</div>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>No files in this folder</p>
        )}
      </div>
    </div>
  );
}

export default SharedFolder;