class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  _parseResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(res.json());
  }

  _getToken() {
    return localStorage.getItem('token');
  }

  signup(params) {
    return fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(this._parseResponse);
  }

  login(params) {
    return fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(this._parseResponse);
  }

  verifyToken() {
    return fetch(`${this.baseUrl}/auth/verify-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  createBoard() {
    return fetch(`${this.baseUrl}/boards`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  getAllBoards() {
    return fetch(`${this.baseUrl}/boards`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  updatePositionsBoards(boards) {
    return fetch(`${this.baseUrl}/boards`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boards),
    }).then(this._parseResponse);
  }

  getOneBoard(boardId) {
    return fetch(`${this.baseUrl}/boards/${boardId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  updateBoard(boardId, params) {
    return fetch(`${this.baseUrl}/boards/${boardId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(this._parseResponse);
  }

  getFavoriteBoards() {
    return fetch(`${this.baseUrl}/boards/favorites`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  updateFavoritePositionsBoards(boards) {
    return fetch(`${this.baseUrl}/boards/favorites`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boards),
    }).then(this._parseResponse);
  }

  deleteBoard(boardId) {
    return fetch(`${this.baseUrl}/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  createSection(boardId) {
    return fetch(`${this.baseUrl}/boards/${boardId}/sections`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  updateSection(boardId, sectionId, params) {
    return fetch(`${this.baseUrl}/boards/${boardId}/sections/${sectionId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(this._parseResponse);
  }

  deleteSection(boardId, sectionId) {
    return fetch(`${this.baseUrl}/boards/${boardId}/sections/${sectionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }

  createTask(boardId, sectionId) {
    return fetch(`${this.baseUrl}/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sectionId),
    }).then(this._parseResponse);
  }

  updateTask(boardId, taskId, params) {
    return fetch(`${this.baseUrl}/boards/${boardId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(this._parseResponse);
  }

  updatePositionTask(boardId, params) {
    return fetch(`${this.baseUrl}/boards/${boardId}/tasks/update-position`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(this._parseResponse);
  }

  deleteTask(boardId, taskId) {
    return fetch(`${this.baseUrl}/boards/${boardId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this._getToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(this._parseResponse);
  }
}

const baseUrl = 'https://easyjet.nomoredomainsrocks.ru/api/v1';
/* const baseUrl = 'http://localhost:3001/api/v1'; */

const api = new Api(baseUrl);

export default api;
