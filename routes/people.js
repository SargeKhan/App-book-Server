/**
 * Created by Usman on 10/4/2014.
 */

exports.getAll =function(request, response) {
    db= request.db;
    console.log("Here");
    people= db.get("people");
    people.find({}, function(err,data){

        if(err){
            console.log("Error Reading data"+ err);
        }else{
            console.log(JSON.stringify(data));
            response.send({"data":data});
        }
    });
};

exports.changeBio= function(request,response){
    console.log("Add Person data:" + JSON.stringify(request.body));
    db= request.db;

    people= db.get("people");
    people.find({"email_id" :request.body.email_id},function(error,data){
        if(error)
            console.log("Error finding person");
        if(data.length==0) {
            response.send("Success!")
        }else{
            data[0].bio=request.body.bio;
            people.update({"email_id":request.body.email_id},{$set : {"bio":request.body.bio}}, function(err, data) {
                if (err) {
                    console.log("Could not add" + error);
                }
                else {
                    response.send("Success");
                    console.log("Entry Created" + data);
                }
            });
        }
    });
};

exports.addPerson = function(request,response){
    console.log("Add Person data:" + JSON.stringify(request.body));
    db= request.db;

    people= db.get("people");
    people.find({"email_id" :request.body.email_id},function(error,data){
        if(error)
            console.log("Error finding person");
        if(data.length==0) {
            people.insert(request.body, function (error, data) {
                if (error) {
                    console.log("Could not add" + error);
                }
                else {
                    response.send("okay");
                    console.log("Entry Created" + data);
                }
            });
        }else
            response.send("okay");
    });
};

exports.getPerson = function(req, res){
    person= req.params;
    console.log(JSON.stringify(person));
    people= req.db.get("people");
    people.find({"email_id":person.email_id},function(error,data){
        if(error)
            console.log(error);
        else{
            if(data.length!= 0)
                res.send(data[0]);
            else
                res.send("Person Not found");
        }
    })

}
exports.findPersonList= function(req, res) {

    query = req.params.keyWord.split("$");
    queryType = query[0];
    queryVal = query[1];
    console.log(query);
    people = req.db.get("people");
    if (queryType == "Find") {
        person = req.params;
        
        console.log("FpFind"+queryVal);
        var obj= JSON.parse(queryVal);
        console.log(obj.name);
        
        var re = new RegExp(obj.name, 'i');
        console.log(re);
        people.find({"name": { $regex: re }}, function (error, data) {
            if (error)
                console.log(error);
            else {
                console.log(JSON.stringify(data));
                res.send(data);
            }
        });
    }else{
        if(queryType== "Next"){
            people.find({},{'skip': queryVal, 'limit':10},function(error,data){
                res.send(data);
            });
        }else
            res.send([]);
    }
};

exports.getFriends= function(req,res){
    friends= req.params.ids.split(",");

    db= req.db;
    console.log(JSON.stringify(friends));

    people= db.get("people");
    people.find({"email_id": { $in: friends}},function(error,data){
        if(!error)
            res.send({"data":data});
        else
            console.log(error);
    });
};
exports.getPeople= function(req, res){
    person= req.params;
    console.log(JSON.stringify(person));
    res.send("In get People");
    /*people= req.db.get("people");
     people.find({"email_id":person.email_id},function(error,data){
     if(error)
     console.log(error);
     else{
     if(data.length!= 0)
     res.send(data[0]);
     else
     res.send("Person Not found");
     }
     })
     */
}



function addApps(appList, db){
    appsDocument= db.get("apps");
    appsRef= [];
    forEach(app, index, appList)
    {
        appsDocument.find({packageName: app.packageName}, function (error, data) {
            if (error)
                console.log("Error while finding app");
            if (data == {}) {
                appsDocument.insert(app, function(error, data){
                    if(error)
                        console.log("Could not insert a new app");
                } );
                appsRef.push(app.packageName);
            }
            if(data.length!= 0){
                appsRef.push(app.packageName);
            }
        });
    }
    return appsRef;
}
