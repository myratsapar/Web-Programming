let keys = document.querySelectorAll('.key')

keys.forEach(key => {
 key.addEventListener('click', playNote)
})

function playNote(e) {
 let key = e.target
 let note = document.getElementById(key.dataset.note)
 note.currentTime = 0
 note.play()
 key.classList.add('active')
 note.addEventListener('ended', () => {
 key.classList.remove('active')
 })
}
