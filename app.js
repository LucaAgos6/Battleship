var app = express();
app.use(express.json());
app.get('/', function (req, res) {
    res.send("Homepage");
});

app.listen(3000, function () {
    console.log('The application is running on localhost:3000!');
});
