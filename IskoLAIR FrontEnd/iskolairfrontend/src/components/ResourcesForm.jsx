import React, { useState, useEffect } from 'react';
import ResourcesApi from '../services/ResourcesApi';
import '../pages/css/ResourcesForm.css';

const ResourcesForm = ({ id, onCancel, onSaved }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(()=>{
    if (id) {
      ResourcesApi.getResourceById(id)
        .then(r => setTitle(r.title))
        .catch(()=> setError('Could not load resource'));
    } else {
      setTitle('');
      setFile(null);
      setError('');
    }
  },[id]);

  const handleSubmit = e => {
    e.preventDefault();
    const op = id
      ? ResourcesApi.updateResource(id, title, file)
      : ResourcesApi.createResource(title, file);

    op.then(()=>{
        onSaved();
      })
      .catch(()=>setError('Save failed'));
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{id?'Edit Resource':'Upload Resource'}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" 
               type="text" 
               value={title} 
               onChange={e=>setTitle(e.target.value)} 
               required />
      </div>
      <div className="form-group">
        <label className="form-label">File</label>
        <input className="form-input"
               type="file"
               onChange={e=>setFile(e.target.files[0])}
               required={!id && !file}/>
      </div>
      <div className="form-actions">
        {id && <button type="button" onClick={onCancel}>Cancel</button>}
        <button type="submit">{id?'Update':'Upload'}</button>
      </div>
    </form>
  );
};

export default ResourcesForm;