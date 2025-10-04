import { useEffect, useState } from 'react';
import { useRedirectIfNotAuthenticated } from '../../hooks/useRedirectIfNotAuthenticated';
import { Link } from 'react-router-dom';
import styles from './Folders.module.css';


function Folders() {
    const [ folders, setFolders ] = useState([]);
    const [ folderValue, setFolderValue ] = useState('');
    const [ errorMessages, setErrorMessages ] = useState([]);


    const { data: responseData, isLoading } = useRedirectIfNotAuthenticated('folders');

    useEffect(() => {
        if (responseData) {
        setFolders(responseData);
        }
    }, [responseData]);

    async function handleSubmit(e) {
        e.preventDefault();
        const url = `${import.meta.env.VITE_DEV_API_URL}folders`;
        const response = await fetch(url, {
            body: JSON.stringify({
                name: folderValue
            }),
            headers: {
                'Content-Type': 'Application/json'
            },
            method: 'POST',
            credentials: 'include'

        });

        const data = await response.json();
        if (data.success) {
            setFolders(prevFolders => [...prevFolders, data.data]);
        } else {
            setErrorMessages(data.errors)
        }
    }


    async function onDelete(folderId) {
        const url = `${import.meta.env.VITE_DEV_API_URL}folders/${folderId}`
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
        });

        const data = await response.json();
        setFolders(folders.filter(folder => folder.id !== data.data.id));
    }

    async function onShare(folderId) {
        const url = `${import.meta.env.VITE_DEV_API_URL}folders/${folderId}/new`;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        console.log("DATA", data.data.hash);
        const shareUrl = `${import.meta.env.VITE_DEV_API_FRONTEND_URL}share/${data.data.hash}`;
        console.log(shareUrl);

    }

        return (
        <div>
            {isLoading 
            ? <div>Loading...</div> 
            : 
            <div>
                <div className={styles.folderGrid}>
                {folders ? folders.map(folder => (
                    <div key={folder.id} className={styles.folderCard}>
                    <Link to={`/folders/${folder.id}`} state={{ folder }} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span className={styles.folderIcon}>📁</span>
                        <div className={styles.folderName}>{folder.name}</div>
                    </Link>
                    <div className={styles.buttonGroup}>
                        <button className={styles.shareButton} onClick={() => onShare(folder.id)}>Share</button>
                        <button className={styles.deleteButton} onClick={() => onDelete(folder.id)}>Delete</button>
                    </div>
                    </div>
                )) : ''}
                </div>
                
                <div className={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="folderName">Folder Name</label>
                    <input
                    type="text"
                    id="folderName"
                    name="folderName"
                    value={folderValue}
                    onChange={e => setFolderValue(e.target.value)}
                    required
                    />
                    <button type="submit">Create Folder</button>
                </form>
                <ul className={styles.errorList}>
                    {errorMessages.map(error => <li key={error.msg}>{error.msg}</li>)}
                </ul>
                </div>
            </div>
            }
        </div>
        );  
}

export default Folders;