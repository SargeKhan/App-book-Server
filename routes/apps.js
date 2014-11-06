/**
 * Created by Usman on 10/10/2014.
 */



//This might not be a great function now, but I learnt all about asynchoronus communication, How shit happens, + ForEach Loop is blocking
//While for Loop is non Blocking! HOLA!
exports.setUserApps= function(req,res){
    reqInfo= req.body;
    console.log("SET USER APPS"+ JSON.stringify(reqInfo));
    db= req.db;
    apps= db.get("apps");
    people= db.get("people");
    people.update({"email_id":reqInfo.email_id}, {$set:{apps:reqInfo.apps}},function(error, data){
        if(error)
            console.log(error);
        console.log(JSON.stringify(data));
    }) ;
    var apps2Upload=[];
    console.log("In the Finding shit");
    //for(i=0;i<reqInfo.apps.length;i++) {
    reqInfo.apps.forEach(function(packName){

        apps.find({"packageName": packName}, function (error, data) {

            if (error)
                console.log(error);
            if (data.length !== 0) {
                apps2Upload.push(data[0].packageName);
            }
            sendResponse();
        });
    });
    callBackReturned=0;
    function sendResponse(){
        if(callBackReturned== reqInfo.apps.length-1){
            c=[];
            j=0;

            for(i=0;i<reqInfo.apps.length;i++) {
                if (apps2Upload.indexOf(reqInfo.apps[i]) == -1)
                    c[j++] = reqInfo.apps[i];
            }
            console.log("Apps Count:" + c.length+ " ,In the end "+ c.length);
            res.send(c);
        }


        else
            callBackReturned++;
    }


};
exports.addApp= function(req, res){
    console.log("IN add Apps");
    db= req.db;
    apps= db.get("apps");
    appInfo= req.body;
    console.log("Length of Icon String" + appInfo.icon.length);
    console.log(JSON.stringify(appInfo))
    apps.insert(appInfo, function(error, data){
       if(error)
            console.log("ERROR"+ error);
        console.log("Success"+ JSON.stringify(data));
        res.send("Ok");
    });
};

exports.getApp = function(req, res){
    console.log("In get Apps");
    db= req.db;
    apps= db.get("apps");
    packageName= req.params.packageName;
    console.log(packageName);
    apps.find({"packageName": packageName},function(error,data){
        if(error)
            console.log("Unable to fetch App");
        else
        {
            console.log(JSON.stringify(data));
            res.send(data[0]);
        }
    });
};