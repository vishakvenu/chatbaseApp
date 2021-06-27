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

const LoginLink=document.getElementById("Login")
const LoginModal=document.getElementById("LoginModal")
const CreateAccountLink=document.getElementById("CreateAccount")
const CreateAccountModal=document.getElementById("CreateAccountModal")

console.log(LoginModal)

LoginLink.onclick=()=>{
    LoginModal.classList.add('show-modal')
    CreateAccountModal.classList.add("hide-modal")
}

CreateAccountLink.onclick=()=>{
    LoginModal.classList.remove('show-modal')
CreateAccountModal.classList.remove("hide-modal")
    CreateAccountModal.classList.add('show-modal')
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