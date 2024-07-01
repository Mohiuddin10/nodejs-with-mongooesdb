const {app, connectDb} = require("./app");

const PORT = 3001;

app.listen(PORT, ()=> {
    console.log(`Server is running at port: http://localhost:${PORT}`);
    connectDb();
})