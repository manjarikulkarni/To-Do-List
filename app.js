//jshint eversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin-manjari:test123@cluster0.tkeo5.mongodb.net/todolistDB",{useNewUrlParser: true},{ useUnifiedTopology: true })

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item",itemsSchema)

const item1 = new Item({
  name: "Buy Milk"
})
const item2 = new Item({
  name: "Buy Egg"
})
const item3 = new Item({
  name: "Buy bread"
})

const defaultItems = [item1,item2,item3]


app.get("/", function(req, res){

  Item.find({},function(err,foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log("err");
        }
        else{
          console.log("Successfully saved default items to DB");
        }
      })
    res.redirect("/")
    }
    else{
      res.render("list",{listTitle:"Today",newListItems:foundItems})

    }

  })

})

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName
})


app.post("/",function(req,res){
  const itemName = req.body.newItem

  const item = new Item({
    name: itemName
  })

  item.save()
  res.redirect("/")

})

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox

  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Successfully deleted checked item");
      res.redirect("/")
    }
  })
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
  console.log("Server started on port successfully.");
});
