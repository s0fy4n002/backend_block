const id = document.getElementById("id")
const title = document.getElementById("title")
const content = document.getElementById("content")
const image = document.getElementById("image")
const upload = document.getElementById("upload")
const formElem = document.getElementById("form")
upload.addEventListener("click", (e) => {
    e.preventDefault()
       
    const data = new FormData()
    data.append('id', id.value)
    data.append('title', title.value)
    data.append('content', content.value)
    data.append('image', image.files[0])

    let data1 = new FormData(formElem)
    
    fetch('http://localhost:8080/post', {
    
        cache: 'no-cache',
        method: "PUT",
        body: data
    
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        const formImg = document.querySelector('.img');
        let createImg = document.createElement("img")
        createImg.src = data.data.image;
        createImg.style.width = "100px"
        createImg.style.height = "50px"
        formImg.append(createImg)
        document.querySelector("#oldImg").remove()
    })
    .catch(err => {
        console.log(err)
    })
})


