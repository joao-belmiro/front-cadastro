<template>
  <div class="container-lg" style="margin-top: 30px">
    <div class="column">
      <template v-for="notificacao in notificacoes">
        <div
          :class="notificacao.tipo=== 1 ? 'alert alert-success alert-dismissible fade show':'alert alert-danger alert-dismissible fade show' "
          :key="notificacao.index">
          <i :class="notificacao.tipo === 1 ? 'fas fa-check': 'fas fa-exclamation-triangle'" style="margin-right: 10px;"></i>{{notificacao.mensagem}}
          <button
            type="button"
            class="close"
            @click="fechar(notificacao)"
          >
            <span> <i class="fas fa-times"></i></span>
          </button>
        </div>
      </template>
    </div>
    <div class="column justify-content-md-center">
      <div class="card" style="margin-bottom: 16px">
        <div class="card-body">
          <h5 class="card-title">Cadastro de Conta</h5>
          <form id="cadastro" @submit.prevent="salvar" @reset="limpar">
            <div class="form-group">
              <label>Nome</label>
              <input
                v-model="conta.nome"
                class="form-control"
                id="exampleInputEmail1"
                placeholder="Digite o seu nome"
                required
              />
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">E-mail</label>
              <input
                v-model="conta.email"
                placeholder="Digite seu e-mail"
                type="email"
                class="form-control"
                id="email"
                aria-describedby="emailHelp"
                required
                 data-error="Por favor, informe um e-mail correto."
              />
              <span :class="emailValido? 'text-success': 'text-danger' ">{{msgEmail}}</span>	
            </div>
            <div class="form-group">
              <label>Cpf</label>
              <input
                v-model="conta.cpf"
                placeholder="Digite o seu cpf"
                class="form-control"
                id="cpf"
                maxlength="11"
                type="text"
                required
              />
                <span :class="cpfValido ? 'text-success': 'text-danger' ">{{msgCpf}}</span>	
            </div>
            <div class="form-group">
              <label>Data de Nascimento</label>
              <input
                v-model="conta.dataNascimento"
                placeholder="Insira a sua data de nascimento"
                type="date"
                class="form-control"
                id="data"
                required
              />
            </div>
            <button
              type="submit"
              class="btn btn-success"
              style="margin-right: 16px"
              :disabled="!(emailValido && cpfValido)"
            >
              <i class="fas fa-save" style="padding-right: 5px"></i> Salvar
            </button>
            <button type="reset" class="btn btn-secondary">
              <i class="fas fa-eraser" style="padding-right: 5px"></i> Limpar
            </button>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Contas Cadastradas</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">E_mail</th>
                <th scope="col">Cpf</th>
                <th scope="col">Data de Nascimento</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="conta in getContasCadastradas">
                <tr :key="conta.idConta">
                  <th scope="row">{{ conta.idConta }}</th>
                  <td>{{ conta.nome }}</td>
                  <td>{{ conta.email }}</td>
                  <td>{{ formatCpf(conta.cpf) }}</td>
                  <td>{{ formataData(conta.dataNascimento) }}</td>
                  <td>
                    <div class="row">
                      <button
                        class="btn btn-primary botao"
                        style="margin-right: 6px"
                        @click="editar(conta)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger botao"
                        @click="excluir(conta)"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import contaService from "../services/contaService.js";
export default {
  name: "contaCadastro",
  data() {
    return {
      msgEmail: null,
      msgCpf: null,
      emailValido: false,
      cpfValido: false,
      conta: {
        idConta: null,
        nome: null,
        dataNascimento: null,
        cpf: null,
        email: null,
      },
      contasCadastradas: [],
      notificacoes: [],
    };
  },
  computed:{
    getContasCadastradas () {
      return this.contasCadastradas
    },
    getCpf() {
      return this.conta.cpf
    },
    getEmail () {
      return this.conta.email
    }
  },
  watch:{
    async getCpf (atual) {
      if (atual !== null && atual.length === 11) {
        let status = await contaService.validarCpf(atual).then(res => res.status).catch((erro) => {
          alert(erro.response.data.message)
        })
        if (status === 204 && this.conta.idConta === null) {
          this.msgCpf ='O Cpf já cadastrado na base de dados insira outro número de cpf'
          this.cpfValido = false
        } else if (status === 200 && this.conta.idConta === null) {
          this.msgCpf = 'O Cpf é válido'
          this.cpfValido = true
        } else {
          this.cpfValido = true
        }
      } else {
        this.cpfValido = false
        this.msgCpf = null
      }
    },
     async getEmail (atual) {
      let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regexEmail.test(atual)){
        const status = await contaService.validarEmail(atual).then(r => r.status).catch(erro=>{
          alert(erro.response.data.message)
        })
          if(status === 204 && this.conta.idConta === null) {
            this.msgEmail = "O email atual já está em uso insira outro endereço"
            this.emailValido = false
          } else if (status === 200 && this.conta.idConta === null) {
            this.msgEmail = 'E-mail válido'
            this.emailValido = true
          } else {
            this.emailValido = true
          }
      } else {
        this.msgEmail = null
        this.emailValido = false
      }
    }
  },
  mounted() {
    this.validarEmail()
  },
  async created() {
    this.contasCadastradas = await contaService
      .buscarTodasContas()
      .then((response) => response.data);
  },
  methods: {
    validarEmail () {
      let email = document.getElementById('email')
      email.value
      console.log(email.value)
    },
    salvar() {
      this.conta.cpf = this.conta.cpf.split('.').join('').split('-').join()
      if (this.conta.idConta !== null) {
        contaService
          .alterarConta(this.conta)
          .then((response) => {
            if (response.status === 200) {
              this.limpar();
              this.editarTabela(response.data)
              this.notificacoes.push(this.gerarNotificacao('Conta Alterada com Sucesso !', 1)) 
            }
          })
          .catch((err) => {
          this.notificacoes.push(this.gerarNotificacao(err.response.data.message), 0)
          });
      } else {
      contaService
        .salvarConta(this.conta)
        .then((response) => {
          if (response.status === 201) {
            this.limpar();
            this.contasCadastradas.unshift(response.data);
            this.notificacoes.push(this.gerarNotificacao('Conta Criada com Sucesso !', 1)) 
          }
        })
        .catch((err) => {
          this.notificacoes.push(this.gerarNotificacao(err.response.data.message), 0)
        });
      }
    },
    editarTabela (conta) {
      let index =  this.contasCadastradas.findIndex(c => c.idConta === conta.idConta)
      let chaves = Object.keys(conta)
      chaves.forEach(c => {
        this.contasCadastradas[index][c] = conta[c]
      })
    },
    fechar(notificacao) {
      this.notificacoes = this.notificacoes.filter(n => n.mensagem !== notificacao.mensagem)
    },
    gerarNotificacao(mensagem, tipo) {
      return {
        index: this.notificacoes.length + 1,
        mensagem: mensagem,
        tipo: tipo
      }
    },
    mascaraCpf() {
      var cpf = document.querySelector("#cpf");
      cpf.addEventListener("blur", function () {
        if (cpf.value)
          cpf.value = cpf.value
            .match(/.{1,3}/g)
            .join(".")
            .replace(/\.(?=[^.]*$)/, "-");
      });
    },
    formataData(data) {
      var val = data.split("-");
      return `${val[2]}/${val[1]}/${val[0]}`;
    },
    editar(conta) {
      console.log(conta);
      const chaves = Object.keys(conta);
      chaves.forEach((c) => {
        this.conta[c] = conta[c];
      });
    },
    async excluir(conta) {
      const res = await contaService.excluirConta(conta.idConta).then(response => {
        return response
      }).catch(err=>{
                  this.notificacoes.push(this.gerarNotificacao(err.response.data.message), 0)
      })
      if (res.status === 204) {
         this.contasCadastradas = this.contasCadastradas.filter(c => c.idConta !== conta.idConta)
         this.notificacoes.push(this.gerarNotificacao('Conta Removida com Sucesso !', 1)) 
        }
    },
    formatCpf(cpf) {
      if (cpf !== null){
      cpf = cpf.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      return cpf;
      }
    },
    limpar() {
      this.conta.idConta = null;
      this.conta.nome = null;
      this.conta.email = null;
      this.conta.dataNascimento = null;
      this.conta.cpf = null;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
