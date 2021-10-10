const auth=firebase.auth()
const db=firebase.firestore()
const picstorage=firebase.storage()
//console.log(db)

const createAccountForm=document.querySelector("#createAccountForm")

const createAccountSpinner=document.querySelector("#CreateAccount-spinner")

const errorMsg=document.querySelector("#success-mesg")

const file=createAccountForm['file']
let filedata={}
file.onchange=(e)=>{
    
    filedata=e.target.files[0]
    
}



createAccountForm.onsubmit=(e)=>{
    e.preventDefault()
    createAccountSpinner.style.display="flex"
    
//   setTimeout(()=>{
//    createAccountSpinner.style.display="none"
//    mainModalSection.style.transform="translateY(-1800px)";
//      },1000)   
    const FirstName=createAccountForm['firstname'].value.toUpperCase()
    const LastName=createAccountForm['lastname'].value.toUpperCase()
    const email=createAccountForm['createAccountEmail'].value
    let password=createAccountForm['createAccountPassword'].value
    let confirmPassword=createAccountForm['createAccountConfirmPassword'].value
    if(password===confirmPassword){
        if( 'name' in filedata){
            auth.createUserWithEmailAndPassword(email,password)
            .then(auth=>{
                
                picstorage.ref(`user/${auth.user.uid}/profile.jpg`).put(filedata)
                .then(()=>{
                    picstorage.ref(`user/${auth.user.uid}/profile.jpg`).getDownloadURL()
                    .then(ImageUrl=>{
                        auth.user.updateProfile({
                    displayName:`${FirstName}`,
                    photoURL:ImageUrl        
                            })
                        
                    db.collection('users').add({
                    UserName:`${FirstName} ${LastName}`,
                    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                    img:ImageUrl
                }).then((res)=>{
//                         renderUserList()  
                        createAccountSpinner.style.display="none"
                        mainModalSection.style.transform="translateY(-1800px)";
                        createAccountForm.reset()
                        window.location.reload()
                        })
                    })
                    
                    })
                
                
            })
            .catch(err=>{
                createAccountSpinner.style.display="none"
                errorMsg.innerText=err.message
            })
            
        }else{
           createAccountForm.querySelector("#fileError").innerText="Please select a file" 
        }
        
    }else{
        createAccountForm['createAccountPassword'].style.border="1px solid red"
        createAccountForm['createAccountConfirmPassword'].style.border="1px solid red"
    }  
    
}

const userImage=document.querySelector('#UserProfileImage')
const userName=document.querySelector('#UserProfileName')
const userEmail=document.querySelector('#UserProfileEmail')
const MessageUserName=document.querySelector('#messageUserName')

const sendUserPic=document.querySelector('#SendMessageUserPic')

let CopieduserID=''
auth.onAuthStateChanged(user=>{
    if(user){
        console.log(user)
        CopieduserID=user.uid
//        createAccountSpinner.style.display="none"
        MessageUserName.innerText=user.displayName
        sendUserPic.src=user.photoURL
        userImage.src=user.photoURL
        userName.innerText=user.displayName
        userEmail.innerText=user.email
        mainModalSection.style.transform="translateY(-1800px)";
        
    }else{
        mainModalSection.style.transform="translateY(0)";
    }
})


const AuthLogout=document.querySelector('#AuthLogoutLink')

AuthLogout.onclick=()=>{
    auth.signOut()
    .then(()=>{
        mainModalSection.style.transform="translateY(0)";
        window.location.reload()
    })
}

const userList=document.querySelector("#UsersOnBoard")
db.collection('users').onSnapshot((snapShot)=>{
    let changes=snapShot.docChanges()
    changes.forEach((change)=>{
        if(change.type==='added'){
            let res=change.doc.data()
            const li=document.createElement("li")
            li.setAttribute('id',"user-profile")
            li.innerHTML=`
                        <div class="profile-pic-wrapper">
                            <img src=${res.img}>
                            
                        </div>
                         
                         <h6 class="userName">${res.UserName}</h4>
                     `
            userList.appendChild(li)
        }
    })
})


const loginForm=document.querySelector("#login-form")
const spinner=document.querySelector("#Login-spinner")
const LoginError=document.querySelector(".error-message")

loginForm.onsubmit=(e)=>{
    e.preventDefault()
    spinner.style.display="flex"
    const email=loginForm['email'].value
    const password=loginForm['password'].value
    auth.signInWithEmailAndPassword(email,password)
    .then(()=>{
        
    
    loginForm.reset()
        setTimeout(()=>{
             spinner.style.display="none"
    mainModalSection.style.transform="translateY(-1800px)"; 
            window.location.reload()
        },2000)
   
     }  
    ).catch(err=>{
        spinner.style.display="none"
        LoginError.innerText=err.message
    })
   
    
}
setTimeout(()=>{
    
console.log(CopieduserID)
},3000)

const inputForm=document.querySelector(".input-form")

const MessageList=document.querySelector("#messageList")
const messageSpinner=document.querySelector('#message-waiting-spinner')
console.log
inputForm.onsubmit=(e)=>{
    e.preventDefault()
    const value=inputForm['txt-message'].value.trim()
//    console.log(value)  
if(value){
    db.collection('message').doc(CopieduserID).collection("personal").add({
        message:value,
        time:firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(res=>{
        console.log(res)
    })
    
} else{
    alert("enter the text")
}
    
    
    
    
}

function deleter(e){
    console.log(e)
        alert(1)
    }

console.log("hi")


setTimeout(()=>{
    db.collection('message').doc(CopieduserID).collection("personal").onSnapshot(snapshot=>{
//     console.log(snapshot)
        let changes=snapshot.docChanges()
        console.log(changes)
     changes.forEach(change=>{
         if(change.type==="added"){
             renderCafe(change.doc.data(),change.doc.id)
             messageSpinner.style.display="none"
         }
         if(change.type==="removed"){
            let item=MessageList.querySelector(`[data-id=${change.doc.id}]`)
             MessageList.removeChild(item)
         }
     })
 })
     
},3000)

const confirmBtn=document.querySelector("#ok")
 
     function renderCafe(item,idVal){
         
//         console.log(item)
        const li=document.createElement("li")
        li.setAttribute('data-id',idVal)
    li.innerHTML=`<div class="message">${item.message} </div>
                  <div class="delete-btn">
                      <i class="fas fa-trash-alt"></i>
                  </div>`
    li.onclick=(e)=>{
        if(e.target.classList.contains('delete-btn') ||e.target.classList.contains('fa-trash-alt') ){
           let overlay=MessageList.parentElement;
           overlay.querySelector(".delete-message-overlay").style.display="flex";
            let itemId=e.target.parentElement.parentElement.getAttribute('data-id')
            console.log(itemId)
           confirmBtn.onclick=()=>{
//               messageSpinner.style.display="block"
               db.collection('message').doc(CopieduserID).collection("personal").doc(itemId).delete().then(res=>{
//                   messageSpinner.style.display="none"
                   console.log("item removed")
               overlayDelete.style.display="none"})
}
//            console.log(itemId)
//         
        }
        
    }
    MessageList.appendChild(li)
   
    inputForm.reset()
     }
         
const overlayDelete=document.querySelector(".delete-message-overlay")

console.log(confirmBtn)
overlayDelete.onclick=(e)=>{
    if(e.target.classList.contains("delete-message-overlay")||e.target.classList.contains("cancel")){
       overlayDelete.style.display="none"
       }
  
}

