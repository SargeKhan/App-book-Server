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
exports.addPerson = function(request,response){



    console.log("Add Person data:" + JSON.stringify(request.body));
    db= request.db;

    people= db.get("people");
    people.find({"email_id" :request.body.email_id},function(error,data){
        if(error)
            console.log("Error finding person");
        if(data.length==0)
        {
            people.insert(request.body, function(error,data){
                if(error) {
                    console.log("Could not add" + error);
                }
                else{
                    response.send("okay");
                    console.log("Entry Created" + data);
                }
            });
        }else{
            response.send("User already exists");
        }
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
exports.findPersonList= function(req, res){

    person= req.params;
    console.log(JSON.stringify(person));
    people= req.db.get("people");
    Data=[];
    people.find({"email_id":person.keyWord},function(error,data){
        if(error)
            console.log(error);
        else{
            if(data.length!= 0){

                Data=  data;
                console.log(JSON.stringify(Data));
            }
        }

        people.find({"name":person.keyWord},function(error,data){
            if(error)
                console.log(error);
            else{
                if(data.length!= 0){
                    Data= Data.concat(data);
                    console.log(JSON.stringify(Data));
                }
                res.send(Data);
            }

        });
    });
   /* people.find({"email_id":nameOrUsername.keyWord},function(error,data){
        if(error)
            console.log(error);
        else{
            if(data.length!= 0) {
                returnedData = returnedData + data;
                res.send(returnedData)
            }

        }*/
     /*   people.find({"name":nameOrUsername.keyWord},function(error,data){
            if(error)
                console.log(error);
            else{
                if(data.length!= 0)
                    returnedData= returnedData+data;

            }
            count=1;
            res.send(returnedData);
        });*/


 //       count1=1;
  //  });
   // res.send(returnedData);
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
