// rendering users info while loading users page

const users_list = document.querySelector('.users-list')
const user_modal = document.querySelector('.user-modal')
const user_info = document.querySelector('.user-info')
const form = document.querySelector('.user-modal__wrapper form')
const users_sort = document.querySelectorAll('.users-sort div p')
const users_sortText = document.querySelector('.users-sort h4')
const users_group = document.querySelector('.users-group input')
const search_input = document.querySelector('.users-search__input')
const search_result = document.querySelector('.users-search__result')

let userId = 0

window.addEventListener('load', () => {
    if(!localStorage.getItem('users')){
        const xhr = new XMLHttpRequest()
        xhr.open('GET' , 'https://jsonplaceholder.typicode.com/users')
        users_list.innerHTML = loadingCard()
        xhr.addEventListener('load' , () => {
            const response = JSON.parse(xhr.response)
            localStorage.setItem('users' , JSON.stringify(response))
            const users = renderUsersInfo(response)
            users_list.innerHTML = users
        })
        xhr.send()
    }else{
        const users = JSON.parse(localStorage.getItem('users'))
        const result = renderUsersInfo(users)
        users_list.innerHTML = result
    }
})

// renders users

function renderUsersInfo(users){
    if(users.length){
        return users.reduce((prev, item) => prev + usersCard(item), '')
    }else{
        return `
            <h3>Nothing found</h3>
        `
    }   
}

// user-info handler

function showUserInfo(user){
    search_result.classList.add('invisible')
    search_input.value = ''
    user_info.classList.remove('user-info_active')
    users_list.classList.add('users-list_active')

    user_info.innerHTML = userInfoCard(user)
}

// user-list handler

function showUserList(){
    users_list.classList.remove('users-list_active')
    user_info.classList.add('user-info_active')
}

// modal handler

function userModalActive(id){
    user_modal.classList.add('user-modal_active')
    userId = id
}

// edit-form handler

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem('users'))
    const result = users.map(user => user.id === userId ? {
            ...user, 
            name: !e.target[0].value ? user.name : e.target[0].value,
            username: !e.target[1].value ? user.username : e.target[1].value,
            email: !e.target[2].value ? user.email : e.target[2].value,
            phone: !e.target[3].value ? user.phone : e.target[3].value,
            website: !e.target[4].value ? user.website : e.target[4].value,
        } : user
    )

    localStorage.setItem("users", JSON.stringify(result));
    window.location.reload()
})

// sorting users by alphabet

users_sort[0].addEventListener('click' , () => {
    users_sortText.textContent = 'default'

    const users = JSON.parse(localStorage.getItem('users'))
    const result = renderUsersInfo(users)
    users_list.innerHTML = result
})

users_sort[1].addEventListener('click' , () => {
    users_sortText.textContent = 'abc'

    const users = JSON.parse(localStorage.getItem('users'))
    const sortedUsers = users.sort((a,b) => a.username > b.username ? 1 : -1)
    const result = renderUsersInfo(sortedUsers)
    users_list.innerHTML = result
})

users_sort[2].addEventListener('click' , () => {
    users_sortText.textContent = 'cba'
    
    const users = JSON.parse(localStorage.getItem('users'))
    const sortedUsers = users.sort((a,b) => a.username < b.username ? 1 : -1)
    const result = renderUsersInfo(sortedUsers)
    users_list.innerHTML = result
})

// user-group handler

users_group.addEventListener('input' , e => {
    const users = JSON.parse(localStorage.getItem('users'))
    const groupedUsers = users.filter(({ username }) => username[0].toLowerCase() === e.target.value.toLowerCase())

    if(groupedUsers.length){
        const result = renderUsersInfo(groupedUsers)
        users_list.innerHTML = result
    }else{
        const result = renderUsersInfo(users)
        users_list.innerHTML = result
    }
})

// users searching handler

search_input.addEventListener('input' , e => {
    const users = JSON.parse(localStorage.getItem('users'))
    const value = e.target.value.toLowerCase()

    const filteredPosts = users.filter(user => user.username.toLowerCase().includes(value))

    if(!value.trim() || !filteredPosts.length){
        search_result.classList.add('invisible')
    }else{
        search_result.classList.remove('invisible')
    }
    const result = filteredPosts.reduce((prev, item) => prev + searchResultCard(item), '')
    search_result.innerHTML = result
})

// search-result card

function searchResultCard(user){
    return `<p onclick='showUserInfo(${JSON.stringify(user)})'>Username: ${user.username}</p>`
}

// users card 

function usersCard(user){
    return `
        <div class="user">
            <div class='user-header'>
                <p class="user__name"><span>Username:</span> ${user.username}</p>
                <p class="user__email"><span>Email:</span> ${user.email}</p>
                <p class="user__phone"><span>Phone:</span> ${user.phone}</p>
                <div>
                    <button onclick='showUserInfo(${JSON.stringify(user)})'>read more</button>
                    <button onclick='userModalActive(${user.id})'>edit</button>
                </div>
            </div>
        </div>
    `
}

// userInfo card

function userInfoCard({
    id, name, username, email, 
    address: { street ,suite, city, zipcode, 
    geo: { lat, lng }},
    phone, website,
    company: { name: companyName, catchPhrase, bs }
}) {
    return `
        <div>
            <button onclick='showUserList()'>back to users</button>
            <p>"id": <span>${id}</span></p>
            <p>"name": <span>"${name}"</span></p>
            <p>"username": <span>"${username}"</span></p>
            <p>"email": <span>"${email}"</span></p>
            <p>"address": <span>{</span></p>
            <div>
                <p>"street": <span>"${street}"</span></p>
                <p>"suite": <span>"${suite}"</span></p>
                <p>"city": <span>"${city}"</span></p>
                <p>"zipcode": <span>"${zipcode}"</span></p>
                <p>"geo": <span>{</span></p>
                <div>
                    <p>"lat": <span>"${lat}"</span></p>
                    <p>"lng": <span>"${lng}"</span></p>
                </div>
                }
            </div>
            }
            <p>"phone": <span>"${phone}"</span></p>
            <p>"website": <span>"${website}"</span></p>
            <p>"company": <span>{</span></p>
            <div>
                <p>"name": <span>"${companyName}"</span></p>
                <p>"catchPhrase": <span>"${catchPhrase}"</span></p>
                <p>"bs": <span>"${bs}"</span></p>
            </div>
            }
        </div>
    `
}

// loader card 

function loadingCard(){
    return `
        <div class='loader'>
            <div class='lds_roller'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>  
    `
}