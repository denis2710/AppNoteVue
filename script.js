// filtros
Vue.filter('data', time => moment(time).format('DD/MM/YYYY HH:mm'))

// nova instancia de vue 
new Vue({
  //elemento css do root do DOM
  el: '#notebook',
  name: 'NoteBook',

  // alguns dados
  data(){ 
    return {
      conteudo:  '## Bloco de notas',
      notas: JSON.parse(localStorage.getItem('notas')) || [],
      // id da nota selecionada
      idSelecionado: localStorage.getItem('idSelecionado') || null,
    }
  }, 
  computed: { 
    previewNota(){ 
      // markdown renderizado em html
      return  this.notaSelecionada ? marked(this.notaSelecionada.conteudo) :  '';
    }, 
    addNotaTituloBotao(){
      return this.notas.length + ' nota(s) já foram criadas';
    },
    notaSelecionada(){ 
      // vai retonar a  nota selecionada da lista de notas
      return this.notas.find(nota => nota.id === this.idSelecionado);
    },
    notasOrdenadas(){
      return this.notas.slice()
              .sort((a, b) => a.criadaem - b.criadaem)
              .sort((a, b) => (a.favorita === b.favorita) ? 0 : a.favorita? - 1 
              : 1)
    },
    qtdLinhas(){ 
      if(this.notaSelecionada){ 
        //conta o numero de linhas 
        return this.notaSelecionada.conteudo.split(/\r\n|\n/).length
      }
    },
    qtdPalavras(){ 
      if(this.notaSelecionada){
        var s = this.notaSelecionada.conteudo
        // modifica os carcteres de nova linha em espacos
        s = s.replace(/\n/g, ' ');
        //remove os espacos iniciais e finais 
        s = s.replace(/(^\s*)|(\s*$)/gi, '');
        // transforma espacos duplicados em 1 
        s = s.replace(/\s\s+/gi, ' ');
        // retorna a quantidade de espacos
        return s.split(' ').length
      }
    }, 
    qtdCaracteres(){ 
      return this.notaSelecionada.conteudo.split('').length
    }
  },
  watch: {
    // assintindo a variavel conteudo
    notas:{ 
      handler : 'salvarNotas',
      deep: true,
    },
    idSelecionado(val) {
      localStorage.setItem('idSelecionado', val);
    }
  },
  methods:{
    salvarNota(){
      console.log('salvando nota', this.conteudo);
      localStorage.setItem('conteudo', this.conteudo);
      this.reportarOperacao('salvar')
    },
    reportarOperacao (nomeOpe){
      console.log('A operacao', nomeOpe,  'foi completada!');
    },
    addNota(){ 
      const time = Date.now();
      const nota = { 
        id: String(time),
        titulo: 'Nova nota ' + (this.notas.length + 1),
        conteudo: '**Olá!** Essa é uma nova nota usando [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) para formatar!!',
        criadaem: time,
        favorita: false,
      }
      //adicionando a lista de notas
      this.notas.push(nota);
    },
    selecionarNota(nota){ 
      this.idSelecionado = nota.id;
    },
    salvarNotas(){ 
      localStorage.setItem('notas', JSON.stringify(this.notas));
      console.log('Notas salvas', new Date());
    }, 
    removerNota(){ 
      if(this.notaSelecionada && confirm('Deletar a nota?')){ 
        // remover a nota do array
        const index = this.notas.indexOf(this.notaSelecionada);
        if(index !== -1){ 
          this.notas.splice(index, 1);
        }
      }
    },
    favoritarNota(){ 
      this.notaSelecionada.favorita ^= true
    }
  },
  created(){ 
    // coloca va var conteudo o conteudo do store
    // ou uma sring padrao de nada armazenado
    this.conteudo = localStorage.getItem('conteudo') || 'Seja bem vindo ao meu **Bloco de notas**'
  }

})
