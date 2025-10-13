// Dados MOCK
const MOCK_DATA = {
    usuarios: [
        { id: 1, email: 'professor@escola.com', senha: '123456', nome: 'Helcio Soares', tipo: 'Professor' }
    ],
    
    turmas: [
        { 
            id: 1, 
            nome: '1º Ano A', 
            ano: 2024, 
            periodo: 'Matutino',
            sala: 'Sala 101',
            capacidade: 30,
            status: 'Ativa'
        }
    ],
    
    alunos: [
        {
            id: 1,
            nome: 'Ana Silva',
            matricula: '20240001',
            email: 'ana.silva@escola.com',
            turma: '1º Ano A',
            telefone: '(11) 99999-9999',
            status: 'Ativo'
        }
    ],
    
    disciplinas: [
        {
            id: 1,
            nome: 'Matemática',
            codigo: 'MAT-001',
            cargaHoraria: 80,
            professor: 'João Silva',
            turma: '1º Ano A',
            status: 'Ativa'
        }
    ]
};

// Funções de CRUD Genéricas
class DataService {
    constructor(key) {
        this.key = key;
        this.loadData();
    }

    loadData() {
        const saved = localStorage.getItem(this.key);
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = MOCK_DATA[this.key] || [];
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        return this.data.find(item => item.id === parseInt(id));
    }

    create(item) {
        const newId = Math.max(...this.data.map(i => i.id), 0) + 1;
        const newItem = { ...item, id: newId };
        this.data.push(newItem);
        this.saveData();
        return newItem;
    }

    update(id, updates) {
        const index = this.data.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updates };
            this.saveData();
            return this.data[index];
        }
        return null;
    }

    delete(id) {
        const index = this.data.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            this.data.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
}

// Instâncias dos serviços
const turmaService = new DataService('turmas');
const alunoService = new DataService('alunos');
const disciplinaService = new DataService('disciplinas');
const usuarioService = new DataService('usuarios');

// === SISTEMA DE LOGIN ===
function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function usuarioLogado() {
    return localStorage.getItem('usuarioLogado') !== null;
}

function getUsuarioLogado() {
    const usuario = localStorage.getItem('usuarioLogado');
    return usuario ? JSON.parse(usuario) : null;
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Verificar login em todas as páginas (exceto index.html)
document.addEventListener('DOMContentLoaded', function() {
    const paginaAtual = window.location.pathname.split('/').pop();
    if (paginaAtual !== 'index.html' && paginaAtual !== '') {
        if (!verificarLogin()) {
            return;
        }
        adicionarBotaoLogout();
    }
});

function adicionarBotaoLogout() {
    const header = document.querySelector('.header-content');
    if (header && !document.querySelector('.btn-logout-header')) {
        const btnLogout = document.createElement('button');
        btnLogout.className = 'btn btn-logout btn-logout-header';
        btnLogout.innerHTML = '🚪 Sair';
        btnLogout.onclick = function() {
            if (confirm('Tem certeza que deseja sair?')) {
                logout();
            }
        };
        header.appendChild(btnLogout);
    }
}

// Funções de Utilidade
function showAlert(message, type = 'info') {
    const alertasExistentes = document.querySelectorAll('.custom-alert');
    alertasExistentes.forEach(alert => alert.remove());

    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}