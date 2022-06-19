import * as http from 'http';

import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

interface IReqUser{
  username: string;
  age: number;
  hobbies: string[];
}

interface IUser extends IReqUser{
  id: string;
}

const db: IUser[] = [];

const server = http.createServer((req: any, res: any) => {
  switch (req.method) {
    case "GET":
      try{
        get(req, res)
      } catch(err: any){
        if(err){
          sendResponse(res, 500, `Internal Server Error: ${err.message} `);
        }
      }
      
    break;

    case "POST":
      try{
        post(req, res)
      } catch(err: any){
        if(err){
          sendResponse(res, 500, `Internal Server Error: ${err.message} `);
        }
      }
    break;

    case "PUT":
      try{
        put(req, res)
      } catch(err: any){
        if(err){
          sendResponse(res, 500, `Internal Server Error: ${err.message} `);
        }
      }
    break;

    case "DELETE":
      try{
        deleteUser(req, res)
      } catch(err: any){
        if(err){
          sendResponse(res, 500, `Internal Server Error: ${err.message} `);
        }
      }
    break;

    default:
      // Send res for requests with no other response
      sendResponse(res, 400, `wrong method, please use GET,POST,PUT or DELETE`);
  }
});

const PORT: string|number = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

function get (req: any, res: any) {

  if (req.url === "/api/users" || req.url === "/api/users/") {
    sendResponse(res, 200, db)
    return;
  }
  if(req.url.startsWith("/api/users/")){
    const reqParts: string[] = req.url.split('/');

    if(reqParts.length !== 4){
      sendResponse(res, 404, `wrong request: ${req.url}`);
      return;
    };

    const reqId: string = reqParts[3].toString();
    if(!uuidValidate(reqId)){
      sendResponse(res, 400, `userId ${reqId} is invalid (not uuid)`);
      return;
    };
    let resObj: IUser|undefined = db.find((user:IUser) => user.id===reqId);

    if(!resObj){
      sendResponse(res, 404, `user with id: ${reqId} - not found`)
      return;
    };

    sendResponse(res, 200, resObj)
    return;
  }
  sendResponse(res, 404,`wrong request: ${req.url}`);
}

function sendResponse(response: any, code: number, message: string|IUser[]|IUser|[]){
  response.statusCode = code;
  response.setHeader("Content-Type", "application/json");
  response.write(JSON.stringify(message));
  response.end();
};


function post(req: any, res: any){
  switch (req.url) {
    case "/api/users/":
    case "/api/users":
      let buffer: string = '';
      req.on('data', (chunk: string)  => {
        buffer += chunk.toString();
      });
      req.on('end', () => {
        const reqBody: IUser = JSON.parse(buffer);

        if(reqBody.username && 
            typeof reqBody.username ==='string' &&
            reqBody.age && 
            typeof reqBody.age ==='number' &&
            reqBody.hobbies && 
            Array.isArray(reqBody.hobbies) &&
            reqBody.hobbies.every((elem)=>(typeof elem === 'string'))
        ){
          let id: string = uuidv4();
          while (db.find((user: IUser) => user.id===id)) {
            id = uuidv4();
          }
          reqBody.id = id;
          const result: IUser = {
            id: reqBody.id,
            username: reqBody.username,
            age: reqBody.age,
            hobbies: reqBody.hobbies,
          }

          db.push(result);
          sendResponse(res, 201, result);
          return;
        }
        sendResponse(res, 400, 'request body does not contain required fields');
      });
    break;
    default:
      res.statusCode = 404;
      res.write(`CANNOT POST ${req.url}`);
      res.end();
  }
}


function put(req: any, res: any) {
  if(req.url.startsWith("/api/users/")){
    
    let buffer: string = '';

    req.on('data', (chunk: string) => {
      buffer += chunk.toString();
    });

    req.on('end', () => {

      const reqParts = req.url.split('/');

      if(reqParts.length !== 4){
        sendResponse(res, 404, `wrong request: ${req.url}`);
        return;
      };
  
      const reqId: string = reqParts[3].toString();
      if(!uuidValidate(reqId)){
        sendResponse(res, 400, `userId ${reqId} is invalid (not uuid)`);
        return;
      };
      const user: IUser|undefined = db.find((user) => user.id===reqId);
  
      if(!user){
        sendResponse(res, 404, `user with id: ${reqId} - not found`)
        return;
      };

      const reqBody: IReqUser = JSON.parse(buffer);

      if(reqBody.username && 
          typeof reqBody.username ==='string'){
        
        user.username = reqBody.username;

      }

      if(reqBody.age && 
          typeof reqBody.age ==='number'){

        user.age = reqBody.age

      }

      if(
        reqBody.hobbies && 
        Array.isArray(reqBody.hobbies) &&
        reqBody.hobbies.every((elem)=>(typeof elem === 'string'))){

        user.hobbies = reqBody.hobbies;

      }
       
        sendResponse(res, 200, user);
        return;
    })
    return;
  }
  sendResponse(res, 400, 'request body does not contain required fields');;
}

function deleteUser(req: any, res: any) {
  if(req.url.startsWith("/api/users/")){
    const reqParts: string = req.url.split('/');

    if(reqParts.length !== 4){
      sendResponse(res, 404, `wrong request: ${req.url}`);
      return;
    };

    const reqId: string = reqParts[3].toString();
    if(!uuidValidate(reqId)){
      sendResponse(res, 400, `userId ${reqId} is invalid (not uuid)`);
      return;
    };
    let indexDelete: number = db.findIndex((user) => user.id===reqId);

    if(indexDelete === -1){
      sendResponse(res, 404, `user with id: ${reqId} - not found`)
      return;
    };

    const userId: string = db[indexDelete].id;

    db.splice(indexDelete,1)
    sendResponse(res, 204, `user with id: ${userId} is delete`)
    return;
  }

  sendResponse(res, 404, `wrong request: ${req.url}`);
}