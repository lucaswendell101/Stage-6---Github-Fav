import { GithubUser } from "./githubUser.js"

export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
 
    
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  delete(usuario){
    const filteredEntries = this.entries.filter(
      entry => entry.login !== usuario.login)
      this.entries = filteredEntries
      this.atualizar()
      this.save()
  }

  async add(username){
    try{
    const userExists = this.entries.find(entry => entry.login === username)

    if (userExists){
      throw new Error ('Usuário já cadastrado')
    }

    const user = await GithubUser.search(username)

    if(user.login === undefined){
      throw new Error('Usuario não encontrado')
    }
  
    this.entries = [user, ...this.entries]
    this.atualizar()
    this.save()

  } catch(error){
    alert(error.message)
  }
  }


}


export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.atualizar()
    this.onadd()
    
  }

  onadd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () =>{
      const value = this.root.querySelector('.search input').value
      this.add(value)
    }
  }
   
  

  atualizar(){
    this.removerLinhas()

    this.entries.forEach(usuario=>{
      const linha = this.criarLinha()
      linha.querySelector('.user img').src = `https://github.com/${usuario.login}.png`
      linha.querySelector('.user p').textContent = `${usuario.name}`
      linha.querySelector('.repositories').textContent = `${usuario.public_repos}`
      linha.querySelector('.followers').textContent = `${usuario.followers}`
      linha.querySelector('.user span').textContent = `${usuario.login}`
      linha.querySelector('a').href = 'https://github.com/lucaswendell101'
     
      this.tbody.append(linha)

      linha.querySelector('.remove').onclick =()=>{
        const isOk = confirm('Certeza que vai remover esse usuário?')
        if (isOk){
          this.delete(usuario)
        }
      }

      
    })
  }



  criarLinha() {
    const tr = document.createElement('tr')
    
      tr.innerHTML =  `
      <td class="user">
            <img src="https://github.com/lucaswendell101.png" alt="user">
            <a href="https://github.com/lucaswendell101" target='blank'>
              <p>Lucas Wendell</p>
              <span>/lucaswendell101</span>
            </a>
          </td>

          <td class="repositories">
            76
          </td>
          <td class="followers">
            1000
          </td>
          <td>
            <button class='remove'>Remover</button>
          </td>
        `
        
       return tr
      }   


  removerLinhas(){
    this.tbody.querySelectorAll('tr').forEach(element => {
      element.remove()
    });
  }


}