const request = require('request')

const AGENT = 'SimpleConnect/1.0.0';

class SimpleConnectError extends Error{
    constructor(messsage,name){
    super(messsage,name);
    this.messsage=messsage;
    this.name=name   
    }
}

class SimpleConnect {
    constructor(url='http://localhost'){
       this.HOST=url;
       this.TOKEN=null;
       this.SESSION=null;
    }


  setCSRFToken(token){
      this.TOKEN=token;
  };

  setSessionCookie(cookie){
    this.SESSION=cookie;
  };
    
async token(){
    return this.request('GET','rest/simpleconnect/token?_format=json');
}

async connect(){
    return this.request('POST','rest/simpleconnect/connect?_format=json');
}

async login(username,password){
    let data={
        "username":username,
        "password":password
    }
    return this.request('POST','rest/simpleconnect/login?_format=json',data);
}

async logout(){
    return this.request('POST','rest/simpleconnect/logout?_format=json');
}

async register(username,password,email){
    let data={
        "username":username,
        "password":password,
        "email":email
    }
    return this.request('POST','rest/simpleconnect/login?_format=json',data);
}


async request(method="GET",path,data=null,content_type="application/json") {
                let h=this.HOST;
                let t=this.TOKEN;
                let s=this.SESSION;
                console.log(method+' '+path+' ('+content_type+')'); 
                if(data!==null)console.log(data);                    
                return new Promise(function(resolve,reject){                
                      var options = {
                          method:method,
                          url: h+'/'+path,
                          method:method,
                         
                          headers: {
                              'User-Agent':  AGENT,
                              'Content-Type': content_type,
                              'X-CSRF-TOKEN': t, 
                              'COOKIE': s           
                          }                            
                        }      
                        //only json content types else formdata
                        if(content_type=='application/json'||content_type=='application/hal+json')options.json=data;
                        else options.form=data;                   
                        request(options                        
                            ,function (error, response, body) {
                                console.log(response.statusCode);
                            if (error) {
                              console.error('request failed:', error);
                              reject(response.statusCode);
                            }
                            if((response.statusCode>=200  && response.statusCode<=300))
                             return resolve(body);  
                            else {
                                console.log('Request Failed Server responded with:', body);
                                return reject(response.statusCode);
                            }
                          }); 
                  }).catch(function(err){            
                      throw new SimpleConnectError('Error '+err)        
                  })        
                  
        }  

} //SimpleConnect Class

  module.exports={SimpleConnect,SimpleConnectError}
