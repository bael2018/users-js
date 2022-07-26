const user_modal_btn = document.querySelector('.user-modal__closer')

user_modal_btn.addEventListener('click' , () => {
    user_modal.classList.remove('user-modal_active')
})