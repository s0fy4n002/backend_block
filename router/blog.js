const BlogPost = require('../models/blog');
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
         "Agustus", "September", "Oktober", "November", "Desember"];
        const tgl = new Date().getFullYear() + '-' + months[new Date().getMonth()] + '-'  + new Date().getDate(); 
        
        const uniqueSuffix = tgl + '-' + file.originalname;
        cb(null, uniqueSuffix)
    }
  })


const uploads = multer({storage});


function blog(app, cors, body, validationResult){

  app.get('/post/:id', (req, res, next) => {
        
        BlogPost.findById(req.params.id)
        .then(result => {
            if(result){
                return res.json({          
                    data: result
                })  
            }
            return res.json({pesan: "data tidak di temukan"})
        })
        .catch(err => {
            res.json({
                message: err            
            })  
        })
    })

    app.get('/post', (req, res, next) => {
        const currentPage = parseInt(req.query.page) || 1
        const perPage     = parseInt(req.query.perPage) || 4
        let totalData;
  
          BlogPost.find()
          .countDocuments()
          .then(count => {
              totalData = count
              return BlogPost.find()
              .skip((currentPage - 1) * perPage)
              .limit(perPage)
          })
          .then(result => {
              res.json({
                  message: "Berhasil Mengambil data",           
                  data: result,
                  total_data:totalData,
                  per_page:perPage,
                  current_page: currentPage
              })  
          })
          .catch(err => {
              res.json({
                  message: "Gagal!"            
              })  
          })           
      })
    

    app.get('/post-detail', uploads.single('image'), (req, res, next) => {
        BlogPost.findById(req.body.id)
        .then(result => {
            res.json({
                message: "Berhasil Mengambil data",           
                data: result
            })  
        })
        .catch(err => {
            res.json({
                message: "Gagal!"            
            })  
        })           
    })

    app.post('/post', uploads.single('image'), (req, res) => {
        if(!req.body.title || !req.body.content){
            return res.status(400).json({
                kesalahan: "title / content kosong!"
            }) 
        }
        if(!req.file){
            console.log(req.file)
            return res.status(400).json({
                kesalahan: "image harus di upload"
            }) 
        }
        let image = req.file.path;
        console.log("req.file.path: ", req.file.path)
        console.log("req.file: ", req.file)
        let newImage = image.split("\\");
        let newStrImage = '';
        for (let i = 0; i < newImage.length; i++) {
            if(newImage[i] == newImage[1]){
                newStrImage += newImage[i]+'/'
            }
            if(newImage[i] == newImage[2]){
                newStrImage += newImage[i]
            }
        }
        
        const Posting = new BlogPost({
            title: req.body.title,
            content: req.body.content,
            image: newStrImage,
            author: {
                _id: 001,
                nama: "Yayan",
                Hp: "082180851183"
            }
        })   
        Posting.save()
        .then( result => {
            res.status(201).json({
                message: "berhasil",          
                data: result
            }) 
        })
        .catch(err => {
            res.status(400).json({
                message: "Gagal",          
                kesalahan: err
            }) 
        })               
    })

    app.get('/postupload', (req, res) => {
        BlogPost.findById('614fd6d4556ef6f2e62e28cc')
        .then(post => {
            return res.render('page/upload', {post})
        })
        .catch(err => {
            res.status(404).json({message: "id tidak ditemukan!"})
        })
        
    })

    app.put('/post', uploads.single('image'), async (req, res) => {
        
        
        try {
            
            const post = await BlogPost.findById(req.body.id)

            if(!req.file){
                if(post.image == ''){
                    post.image = 'images/thumb.png';
                }
            }else{
                let image = req.file.path;
                let newImage = image.split("\\");
                let newStrImage = '';
                for (let i = 0; i < newImage.length; i++) {
                    if(newImage[i] == newImage[1]){
                        newStrImage += newImage[i]+'/'
                    }
                    if(newImage[i] == newImage[2]){
                        newStrImage += newImage[i]
                    }
                }

                if(newStrImage !== post.image){
                    fs.unlink(`public/${post.image}`, (err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                }
                post.image = newStrImage
            }
            post.title = req.body.title;
            post.content = req.body.content;            
            const simpan = await post.save()
            if(!simpan){
                return res.json({
                    message: "Gagal simpan!"            
                })  
            }

            return res.json({
                message: "berhasil Update",
                data: simpan
            })  

            
        } catch (error) {
            res.status(404).json({message: "Gagal simpan!", error:error })  
        }
    })

    app.delete('/post', uploads.single('image'), async (req, res) => {
        try {
            const hapus = await BlogPost.findByIdAndDelete(req.body.id)    
            if(!hapus){
                return res.status(404).json({title: "Blog tidak ditemukan"}) 
            }
            fs.unlink(`public/${hapus.image}`, (err) => {
                if(err){
                    return res.json({pesan: 'Gagal hapus image', err})
                }else{
                    return res.json({pesan: 'berhasil hapus image'})
                }
            })
            return res.status(201).json({title: "Berhaisl hapus", data: hapus}) 

        } catch (error) {
            return res.json({
                title: "Gagal Hpus Blog / blog tidak di temukan"            ,
                err: error
            }) 
        }
    })

    app.get("/hapus-image", (req, res) => {
        let strImage =  'public\\images\\2021-September-25 Desert.jpg'
        let resultstr = strImage.split("\\")
        let newStrImage ='';
        resultstr.forEach(str => {
            newStrImage+=`${str}/`
        })
        
        
        fs.unlink(newStrImage, (err) => {
            if(err){
                return res.json({pesan: 'Gagal hapus image', err})
            }else{
                return res.json({pesan: 'berhasil hapus image'})
            }
        })

    })

}



module.exports = blog