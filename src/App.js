import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: document.getElementById('title').value,
      url: document.getElementById('url').value,
      techs: document.getElementById('techs').value,
    });

    document.getElementById('title').value = "";
    document.getElementById('url').value = "";
    document.getElementById('techs').value= "";

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    setRepositories(repositories.filter(repository => repository.id !== id));
  }

  async function handleAddLike(id) {
    await api.post(`/repositories/${id}/like`);

    api.get('/repositories').then((response) => {
      setRepositories(response.data);
    });
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            <a href={repository.url} target='_blank' >{repository.title}</a> - {repository.techs} - {repository.likes}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
            <button className="Like" onClick={() => handleAddLike(repository.id)}>
              Like
            </button>
          </li>
        ))}
      </ul>
      <br/>
      <table>
        <tr>
          <td>
            <label for="title">Título do repositório:</label>
          </td>
          <td>
            <input type="text" id="title" required />
          </td>
        </tr>
        <tr>
          <td>
            <label for="url">URL do repositório:</label>
          </td>
          <td>
            <input type="url" id="url" required />
          </td>
        </tr>
        <tr>
          <td>
            <label for="techs">Techs do repositório:</label>
          </td>
          <td>
            <input type="text" id="techs" required />
          </td>
        </tr>
      </table>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
