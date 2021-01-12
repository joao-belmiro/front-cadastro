import axios from 'axios'
const BASE_URL = 'http://localhost:8082'
export default {
    salvarConta: (conta) => axios.post(BASE_URL+'/conta/salvar', conta),
    alterarConta: (conta) => axios.put(BASE_URL+'/conta/alterar', conta),
    buscarTodasContas: () => axios.get(BASE_URL+'/conta/listar-todas'),
    excluirConta: (idConta) => axios.delete(BASE_URL+'/conta/excluir/'+idConta),
    validarCpf: (cpf) => axios.get(BASE_URL+ '/conta/validar-cpf/'+cpf),
    validarEmail: (email) => axios.get(BASE_URL+ '/conta/validar-email/'+email)
}
