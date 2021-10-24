function main(app, cors){
    

    app.get('/', (req, res, next) => {
        res.render('page/index')        
    })


    app.get('/products', (req, res, next) => {
        
        res.json({
            name: "Prawito Hudoro",
            email: "prawitohudoro@gmail.com"
        })        
    })

    app.post('/products', (req, res, next) => {
        console.log(req.body)
        res.json({
            message: "Post Products"            
        })        
    })

    app.put('/products', (req, res, next) => {
        
        res.json({
            message: "Put Products"            
        })        
    })

    app.patch('/products', (req, res, next) => {
        
        res.json({
            message: "patch Products"            
        })        
    })

    app.delete('/products', (req, res, next) => {
        console.log(req.body)
        res.json({
            title: "delete Products"            
        })        
    })

    app.options('/products', cors(), (req, res, next) => {
        res.json({pesan: "dari method options"})        
    })

    app.head('/products', cors(), (req, res, next) => {
        res.json({pesan: "dari method Head"})        
    })



}

module.exports = main