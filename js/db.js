const auth=firebase.auth()
const db=firebase.firestore()
const picstorage=firebase.storage()
//console.log(db)

const createAccountForm=document.querySelector("#createAccountForm")

const createAccountSpinner=document.querySelector("#CreateAccount-spinner")

const errorMsg=document.querySelector("#success-mesg")
console.log(errorMsg)

const file=createAccountForm['file']
console.log(file)
let filedata={}
file.onchange=(e)=>{
    
    filedata=e.target.files[0]
    console.log(filedata)
    
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
                         renderUserList()  
                        createAccountSpinner.style.display="none"
                        mainModalSection.style.transform="translateY(-1800px)";
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
console.log(sendUserPic)

auth.onAuthStateChanged(user=>{
    if(user){
        console.log(user)
        
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
console.log(AuthLogout)

AuthLogout.onclick=()=>{
    auth.signOut()
    .then(()=>{
        mainModalSection.style.transform="translateY(0)";
    })
}

const userList=document.querySelector("#UsersOnBoard")
console.log(userList)
db.collection('users').onSnapshot((snapShot)=>{
    let changes=snapShot.docChanges()
    changes.forEach((change)=>{
        if(change.type==='added'){
            let res=change.doc.data()
        console.log(change.doc.data())
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
