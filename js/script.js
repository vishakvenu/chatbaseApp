const overlay=document.querySelector("#overlay")
const button=document.querySelector(".btn")
const sideSection=document.querySelector(".side-section")
//console.log(button,sideSection)
button.onclick=()=>{
//    alert(1)
    sideSection.classList.add("show-side-section")
}
overlay.onclick=(e)=>{
    if(e.target.id==="overlay"){
        sideSection.classList.remove("show-side-section")
    }
}
const loginModal=document.querySelector("#LoginModal")
const firstLink=document.querySelector("#CreateAccount")

const createModal=document.querySelector("#CreateAccountModal")

const secondLink=document.querySelector("#Login")
const loginBtn=document.querySelector("#loginBtn")

const mainModalSection=document.querySelector('#account-section')
firstLink.onclick=()=>{
    createModal.classList.add('show-modal')
    loginModal.classList.add('hide-modal')
}
secondLink.onclick=()=>{
    createModal.classList.remove('show-modal')
    loginModal.classList.add('show-modal')
    loginModal.classList.remove('hide-modal')
}

loginBtn.onclick=()=>{
    mainModalSection.style.transform="translateY(-1800px)"
}










const inputForm=document.querySelector(".input-form")

const MessageList=document.querySelector("#messageList")
console.log
inputForm.onsubmit=(e)=>{
    e.preventDefault()
    const value=inputForm['txt-message'].value
    console.log(value)
    
    const li=document.createElement("li")
    li.innerHTML=`<div class="message">${value}</div>
                  <div class="delete-btn">
                      <i class="fas fa-trash-alt"></i>
                  </div>`
    MessageList.appendChild(li)
    inputForm.reset()
}