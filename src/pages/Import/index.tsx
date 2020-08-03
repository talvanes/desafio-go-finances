import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  // Uploads files to import transactions //
  async function handleUpload(): Promise<void> {
    const data = new FormData();

    // set uploaded file
    const [uploadedFile] = uploadedFiles;

    data.set('file', uploadedFile.file, uploadedFile.name);

    try {
      // upload file
      await api.post('/transactions/import', data);

      // redirect to dashboard (home page)
      history.push('/');
    } catch (err) {
      // show errors
      console.log(err.response.error);
    }
  }

  // Handles files to be uploaded
  function submitFile(files: File[]): void {
    // set files to upload
    const uploads: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size, { fullform: true }),
    }));

    setUploadedFiles(uploads);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
